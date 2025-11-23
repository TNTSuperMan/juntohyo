export const binaryToHex = (binary: Uint8Array): string => {
    return [...binary].map(e => e.toString(16).padStart(2, "0")).join("");
}

export const hexToBinary = (hex: string): Uint8Array => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0;i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
