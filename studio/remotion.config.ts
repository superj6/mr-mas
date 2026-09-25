import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
// CPU-only machine with ~9 GB free RAM: keep parallel Chrome tabs modest.
Config.setConcurrency(4);
