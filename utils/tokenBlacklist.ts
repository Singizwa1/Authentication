class TokenBlacklist {
  private blacklist: Set<string> = new Set();
  private expirationTimes: Map<string, number> = new Map();

  
  addToken(token: string, expiresInMs: number = 4 * 60 * 60 * 1000): void {
    const expirationTime = Date.now() + expiresInMs;
    this.blacklist.add(token);
    this.expirationTimes.set(token, expirationTime);
    this.cleanupExpiredTokens();
  }

  
  isTokenBlacklisted(token: string): boolean {
    if (!this.blacklist.has(token)) {
      return false;
    }
    
    const expirationTime = this.expirationTimes.get(token);
    if (expirationTime && Date.now() > expirationTime) {
      this.removeToken(token);
      return false;
    }
    
    return true;
  }


  private removeToken(token: string): void {
    this.blacklist.delete(token);
    this.expirationTimes.delete(token);
  }


  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, expirationTime] of this.expirationTimes.entries()) {
      if (now > expirationTime) {
        this.removeToken(token);
      }
    }
  }

  
  getSize(): number {
    return this.blacklist.size;
  }
}

export const tokenBlacklist = new TokenBlacklist();