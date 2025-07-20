import {getSvgPath} from 'figma-squircle';

export const getUniqID = (): string => Math.random().toString(36).slice(2);

export const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number = 100) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

type IClipCorners = {
    height: number;
    width: number;
    radius: number;
    smoothing: number;
}

export const clipCorners = ({
                             height,
                             width,
                             radius,
                             smoothing = 1
                         }: IClipCorners): string => {
    const svgPath = getSvgPath({
        width: width,
        height: height,
        cornerRadius: radius,
        cornerSmoothing: smoothing,
    });

    return `path('${svgPath}')`;
}