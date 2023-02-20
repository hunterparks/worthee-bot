import { getInfo } from 'ytdl-core';
import {
  AudioResource,
  createAudioResource,
  demuxProbe,
} from '@discordjs/voice';
import { exec as ytdl } from 'youtube-dl-exec';
import { VideoInfoType } from '../types';

export interface TrackData {
  url: string;
  title: string;
  onStart: (videoInfo: VideoInfoType) => void;
  onFinish: () => void;
  onError: (error: Error) => void;
}

const noop = () => {};

export class Track implements TrackData {
  public readonly url: string;
  public readonly title: string;
  public readonly onStart: (videoInfo: VideoInfoType) => void;
  public readonly onFinish: () => void;
  public readonly onError: (error: Error) => void;

  private constructor({ url, title, onStart, onFinish, onError }: TrackData) {
    this.url = url;
    this.title = title;
    this.onStart = onStart;
    this.onFinish = onFinish;
    this.onError = onError;
  }

  public createAudioResource(): Promise<AudioResource<Track>> {
    return new Promise(async (resolve, reject) => {
      const process = ytdl(
        this.url,
        {
          output: '-',
          quiet: true,
          format: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
          limitRate: '100K',
        },
        { stdio: ['ignore', 'pipe', 'ignore'] }
      );
      if (!process.stdout) {
        reject(new Error('No stdout'));
        return;
      }
      const stream = process.stdout;
      const onError = (error: Error) => {
        if (!process.killed) process.kill();
        stream.resume();
        reject(error);
      };
      process
        .once('spawn', () => {
          demuxProbe(stream)
            .then((probe: { stream: any; type: any }) =>
              resolve(
                createAudioResource(probe.stream, {
                  metadata: this,
                  inputType: probe.type,
                })
              )
            )
            .catch(onError);
        })
        .catch(onError);
    });
  }

  public static async from(
    url: string,
    methods: Pick<Track, 'onStart' | 'onFinish' | 'onError'>
  ): Promise<Track> {
    const info = await getInfo(url);
    const videoInfo = {
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
    };
    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = noop;
        methods.onStart(videoInfo);
      },
      onFinish() {
        wrappedMethods.onFinish = noop;
        methods.onFinish();
      },
      onError(error: Error) {
        wrappedMethods.onError = noop;
        methods.onError(error);
      },
    };
    return new Track({
      title: info.videoDetails.title,
      url,
      ...wrappedMethods,
    });
  }
}
