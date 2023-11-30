import { getSavedSettings } from '../../Settings';

export const fileExtensions = ['.json', '.arb'];

export const parse = (content: string): Promise<any> => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return Promise.resolve(undefined);
  }
};

export const serialize = async (data: object): Promise<string | undefined> => {
  try {
    const settings = getSavedSettings();
    const spacesIndent = parseInt(settings.customSettings.spacesIndentation, 10) || 2;
    return JSON.stringify(data, null, spacesIndent); // #4
  } catch (e) {
    return undefined;
  }
};
