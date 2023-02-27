export class ObjectUtil {
    public static isNullOrUndefined(object): boolean {
        return object === null || object === undefined;
    }

    public static isEmpty(text: string) {
        return text === '';
    }

    public static isListValid(list): boolean {
        return !ObjectUtil.isNullOrUndefined(list) && list.length > 0;
    }
}
