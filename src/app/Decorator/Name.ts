export function Name(name: string) {
    return function decorator(target: any) {
        target._name = name;
        return target;
    };
}
