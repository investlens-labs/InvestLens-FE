const targetUrl = process.env.SMOKE_URL ?? "https://investlens.mandoo4137-a53.workers.dev/login";
const attempts = Number(process.env.SMOKE_ATTEMPTS ?? 8);
const delayMs = Number(process.env.SMOKE_DELAY_MS ?? 5_000);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const response = await fetch(targetUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    const isInvestLensPage = body.includes("InvestLens") && body.includes("<html");

    if (response.ok && isInvestLensPage) {
      console.log(`Smoke test passed: ${response.status} ${response.url} (${attempt}/${attempts})`);
      process.exit(0);
    }

    console.warn(
      `Smoke test pending: ${response.status} ${response.url}, expected InvestLens HTML (${attempt}/${attempts})`,
    );
  } catch (error) {
    console.warn(`Smoke test request failed (${attempt}/${attempts}): ${error.message}`);
  }

  if (attempt < attempts) {
    await sleep(delayMs);
  }
}

console.error(`Smoke test failed after ${attempts} attempts: ${targetUrl}`);
process.exit(1);
