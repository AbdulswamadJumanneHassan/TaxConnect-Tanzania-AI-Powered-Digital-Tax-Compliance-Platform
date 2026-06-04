import { NextResponse } from "next/server";

function getResponse(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("m-pesa") || normalized.includes("mpesa")) {
    return "Unaweza kuunganisha M-Pesa Business kwa Smart Tax ili kupokea malipo ya haraka na kupata ripoti za mauzo kwa urahisi.";
  }

  if (normalized.includes("jisajili") || normalized.includes("sajili")) {
    return "Jisajili kwa Smart Tax sasa, tutaandaa wasifu wako wa kodi na kukusaidia kufanya mahesabu ya TRA kwa biashara yako.";
  }

  if (normalized.includes("kod") || normalized.includes("tax")) {
    return "Kodi ya biashara inategemea mapato yako. Tunashauri kuweka rekodi za mauzo na kutuma taarifa kwa TRA kwa wakati.";
  }

  if (normalized.includes("dashboard") || normalized.includes("dash")) {
    return "Dashboard inaonyesha muhtasari wa mauzo, risiti za digitali, na taarifa za kodi kwa biashara yako.";
  }

  const responses = [
    "Karibu! Smart Tax inasaidia biashara zako kwa kutoa msaada wa kodi kwa Kiswahili.",
    "Kwa biashara ndogo, ni muhimu kuweka rekodi za mapato na kutumia risiti za digitali ili kuepuka matatizo ya TRA.",
    "Tuma maswali yako kuhusu kodi, M-Pesa, au usajili na nitakusaidia kupata mwanga.",
    "Hakikisha unaweka taarifa za mauzo kila mwezi ili uweze kulipa kodi kwa usahihi.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: Request) {
  const body = await request.json();
  const question = String(body.question || "").trim();

  if (!question) {
    return NextResponse.json(
      { error: "Tafadhali uliza swali kwanza" },
      { status: 400 }
    );
  }

  return NextResponse.json({ answer: getResponse(question) });
}
