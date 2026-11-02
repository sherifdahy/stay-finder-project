import { validateStay } from "./validate-stay";

export function validateStayInput(
    checkIn: string,
    checkOut: string
): boolean {
    const today = new Date().toISOString().slice(0, 10);

    return validateStay(checkIn, checkOut, today);
}
