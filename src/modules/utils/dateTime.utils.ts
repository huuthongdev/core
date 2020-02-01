export class DateTimeUtils {
    static timeToSeconds(time: any): number {
        time = new Date(time);
        return +Math.floor(time.getTime() / 1000).toFixed(0)
    }

    static secondsToTime(time: any) {
        if (!time) return;
        try {
            return new Date(time * 1000)
        } catch (error) {
            return;
        }
    }

    static formatToShow(seconds: number, isShowTime = true) {
        if (!seconds) return '--';
        const time = new Date(seconds * 1000);
        let hours = time.getHours();
        let min: any = time.getMinutes();
        min = min < 10 ? `0${min}` : min;
        if (!isShowTime) return `${time.toLocaleDateString('en-GB')}`;
        return `${time.toLocaleDateString('en-GB')} - ${hours}:${min}`;
    }
}