import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { submission_id } = (await req.json()) as { submission_id: string };
  const gasUrl = process.env.GAS_URL;

  if (gasUrl && submission_id) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'line_click', submission_id }),
        signal: controller.signal,
      });
    } catch {
      // 非クリティカルな分析データのため失敗しても続行
    } finally {
      clearTimeout(timer);
    }
  }

  return NextResponse.json({ success: true });
}
