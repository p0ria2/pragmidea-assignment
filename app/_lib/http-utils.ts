export async function sendRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error((await response.json()).message || response.statusText);
    }

    return response.json();
}