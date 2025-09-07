// Input validation utilities for security

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .substring(0, 255); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  // Allow Russian phone numbers and international format
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 16;
};

export const validateName = (name: string): boolean => {
  // Allow letters, spaces, hyphens, apostrophes - common in names
  const nameRegex = /^[a-zA-Zа-яёА-ЯЁ\s\-']{1,50}$/;
  return nameRegex.test(name.trim());
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one letter, one number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Rate limiting utility for client-side
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }
    
    const keyAttempts = this.attempts.get(key)!;
    
    // Remove old attempts
    const recentAttempts = keyAttempts.filter(time => time > windowStart);
    this.attempts.set(key, recentAttempts);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();