
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return new Response(JSON.stringify({ error: "Tafadhali uliza swali kwanza" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = process.env.GITHUB_MODELS_TOKEN;

    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Wewe ni "Smart Tax AI Assistant", msaidizi wa kidijitali wa kodi kwa wafanyabiashara wa Tanzania. 
            Lengo lako ni kusaidia watumiaji kuelewa:
            1. Taratibu za kodi za TRA (Tanzania Revenue Authority).
            2. Namna ya kusimamia mapato na matumizi ya biashara.
            3. Kuunganisha mifumo ya malipo kama M-Pesa Business.
            4. Kutumia risiti za kidijitali (Digital Receipts) kwa ufanisi.
            
            Zingatia:
            - Tumia Kiswahili fasaha na rafiki kama lugha kuu.
            - Kuwa mtaalamu na mwenye kutoa majibu ya vitendo (actionable).
            - Majibu yawe mafupi na yenye kueleweka.
            - Ikiwa swali halihusiani na kodi au biashara, jaribu kuelekeza mtumiaji kwenye huduma za Smart Tax kwa upole.`,
          },
          { role: "user", content: question },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "GitHub Models API error");
    }

    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    const errorMessage = `Samahani, kuna tatizo la kiufundi: ${error.message || "Unknown Error"}. Jaribu tena baadae.`;

    return new Response(errorMessage, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
