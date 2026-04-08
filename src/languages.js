/**
 * @typedef {Object} Language
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} isRegular
 * @property {function(string): boolean} check - Membership function
 * @property {function(number): string} generateExample - Generates a string of length >= p
 */

export const languages = [
  {
    id: 'anbn',
    name: 'aⁿbⁿ',
    description: 'Strings consisting of n "a"s followed by n "b"s. This is a classic non-regular language.',
    isRegular: false,
    check: (s) => {
      const match = s.match(/^(a+)(b+)$/);
      if (!match) return false;
      return match[1].length === match[2].length;
    },
    generateExample: (p) => {
      const n = Math.ceil(p / 2);
      return 'a'.repeat(n) + 'b'.repeat(n);
    }
  },
  {
    id: 'wwr',
    name: 'wwᴿ',
    description: 'Palindromes of even length over {a, b}. This is a non-regular language.',
    isRegular: false,
    check: (s) => {
      if (s.length % 2 !== 0) return false;
      const left = s.slice(0, s.length / 2);
      const right = s.slice(s.length / 2).split('').reverse().join('');
      return left === right;
    },
    generateExample: (p) => {
      const n = Math.ceil(p / 2);
      const half = 'a'.repeat(n) + 'b'.repeat(n); // Just an example
      return half + half.split('').reverse().join('');
    }
  },
  {
    id: 'prime',
    name: 'aᵖ (p is prime)',
    description: 'Strings of "a"s where the length is a prime number. Non-regular.',
    isRegular: false,
    check: (s) => {
      if (!/^a+$/.test(s)) return false;
      const n = s.length;
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    },
    generateExample: (p) => {
      const isPrime = (n) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      };
      let n = Math.max(2, p);
      while (!isPrime(n)) n++;
      return 'a'.repeat(n);
    }
  },
  {
    id: 'astar_bstar',
    name: 'a*b*',
    description: 'Any number of "a"s followed by any number of "b"s. This is a regular language.',
    isRegular: true,
    check: (s) => /^a*b*$/.test(s),
    generateExample: (p) => 'a'.repeat(p) + 'b'.repeat(p)
  },
  {
    id: 'even_a',
    name: 'Even number of "a"s',
    description: 'Strings over {a, b} containing an even number of "a"s. Regular.',
    isRegular: true,
    check: (s) => (s.match(/a/g) || []).length % 2 === 0,
    generateExample: (p) => {
      const s = 'ab'.repeat(Math.ceil(p / 2));
      return (s.match(/a/g) || []).length % 2 === 0 ? s : s + 'a';
    }
  },
  {
    id: 'ab_star',
    name: '(ab)*',
    description: 'Repeated "ab" pairs. Regular.',
    isRegular: true,
    check: (s) => /^(ab)*$/.test(s),
    generateExample: (p) => 'ab'.repeat(Math.ceil(p / 2))
  }
];
