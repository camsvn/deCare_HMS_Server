import { mainDB } from "../providers/Database";

export async function getSetting(key: string, fallback: string): Promise<string> {
    const row = await mainDB.Settings?.findOne({ where: { key } }) as { value?: string } | null;
    const value = row?.value;
    return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export async function getSettingInt(key: string, fallback: number): Promise<number> {
    const raw = await getSetting(key, String(fallback));
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
}
