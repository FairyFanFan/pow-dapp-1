import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTokenPrice } from '@/lib/erc20';

const originalFetch = (globalThis as any).fetch;

describe('getTokenPrice (CoinGecko)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches ETH price via CoinGecko simple/price and caches it', async () => {
    const mockResponse = { ethereum: { usd: 2501.23 } } as const;
    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toContain('api.coingecko.com/api/v3/simple/price');
      return new Response(JSON.stringify(mockResponse), { status: 200 });
    });
    (globalThis as any).fetch = mockFetch;

    const p1 = await getTokenPrice('ETH');
    expect(p1).toBe(2501.23);

    // second call should hit cache (no extra fetch if within TTL); we'll allow one call
    const p2 = await getTokenPrice('ETH');
    expect(p2).toBe(2501.23);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    (globalThis as any).fetch = originalFetch;
  });

  it('fetches ERC20 price via token_price/ethereum with contract address', async () => {
    const usdt = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const mockResponse = { [usdt.toLowerCase()]: { usd: 1.0 } } as const;

    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      expect(url).toContain('api.coingecko.com/api/v3/simple/token_price/ethereum');
      expect(url).toContain(encodeURIComponent(usdt));
      return new Response(JSON.stringify(mockResponse), { status: 200 });
    });
    (globalThis as any).fetch = mockFetch;

    const price = await getTokenPrice(usdt);
    expect(price).toBe(1.0);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    (globalThis as any).fetch = originalFetch;
  });
}); 