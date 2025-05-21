import { PassengerType } from "@/_types";

export const PassengerAgeRange: Record<PassengerType, string> = {
    [PassengerType.ADULTS]: '12+',
    [PassengerType.CHILDREN]: '2-11',
    [PassengerType.INFANTS]: 'Under 2',
};

export function getPassengerCount(value: Record<PassengerType, number>) {
    return Object.values(value).reduce((acc, curr) => acc + curr, 0);
}
