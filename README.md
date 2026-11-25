# 🔐 Cipher Galaxy

A space-themed exam-practice game for **IDATT2503 – Programvaresikkerhet og kryptografi / Software security and cryptography** (NTNU). Bilingual (🇳🇴 / 🇬🇧), a single offline HTML file, no tracking.

**▶ Play:** https://pedropcardonaa.github.io/cipher-galaxy/

## What's inside
- **287 questions across 12 topic "planets"**, 114 of them calculations. Half cover software security and half cover cryptography, like the exam:

| | Planet | Topic | Questions |
|---|---|---|---|
| 🕸️ | Injectia | Web code review: SQLi, command injection, SSTI, XSS, SSRF, path traversal, XXE, access control | 23 |
| 🍪 | Cookie Nebula | Web, headers and authentication: cookie flags, security headers, pentest, nmap, the Bash/curl fuzz loop, 2FA, password storage | 25 |
| 💥 | Overflow Prime | Binary exploitation: stack overflow, shellcode, canary/NX/ASLR/PIE/RELRO, ROP chains, format strings | 25 |
| ⚙️ | Registron | Assembly tracing (x86-64): registers, syscalls, flags, loops | 23 |
| 🐛 | Fuzzar | Fuzzing and sanitizers: libFuzzer, coverage, instrumentation, ASan/UBSan/MSan/TSan | 23 |
| 🛠️ | Z3-Station | Systems programming and formal verification: OpenSSL, memory safety, Z3 | 21 |
| 🔢 | Modulo | Number theory: Euclid, inverses, φ, Fermat/Euler, square-and-multiply, generators | 18 |
| 🔐 | RSA Major | RSA: key generation, d via extended Euclid, encryption/decryption, signatures, RSA vs AES | 30 |
| 🪓 | Factoria | Attacks on RSA: Fermat, Pollard p−1, shared primes, small e, malleability, chosen ciphertext | 25 |
| 🤝 | Diffie-Hellion | Diffie-Hellman and ElGamal: key exchange, encryption/decryption, MITM, discrete log | 24 |
| 🧂 | Hashara | Hash functions and MACs: properties, birthday bound, length extension, HMAC, CBC-MAC, password hashing | 24 |
| 🗝️ | Caesaria | Symmetric crypto, TLS and classical ciphers: AES, modes, OTP, randomness, TLS 1.3, affine ciphers, LFSR | 26 |

- **Question sources:**
  - real tasks from the **2023, 2024 and 2025 exams**, split into gradeable sub-questions;
  - the four 2026 **crypto assignments**;
  - new practice questions in the same style.
- **Question types:** single choice, true/false, "select all that are true", and **type-the-number** calculations (RSA, ElGamal, Euclid, assembly traces and more).
- **Code shown like on the exam:** vulnerable web code, C programs, ROP gadgets and assembly listings appear in code boxes.
- **Formulas:** every calculation shows the formula you need in a 📐 Formula box, typeset with a bundled copy of [KaTeX](https://katex.org) so it works offline.
- **🧭 Navigation guide:** 81 cards, a searchable cheat sheet for every planet, opened from the map. It covers payloads, protections and their bypasses, registers, crypto formulas and attacks, each with explanations, typical mistakes and worked examples.
- **Modes:**
  - **🧪 Practice:** explanations after every answer, including why each wrong option is wrong.
  - **🧮 Math:** only the calculations.
  - **📝 Exam:** no feedback until you submit, an optional timer, and a grade on the NTNU percentage scale.
- **📄 Export PDF:** a full report of your exam, with every question and explanation.
- Light, dark and auto themes, plus keyboard shortcuts. Progress is stored only in your browser's `localStorage`.

## Scoring
| Type | Correct | Wrong | Blank |
|---|---|---|---|
| Single choice (n options) | +1 | −1/n | 0 |
| True/false | +1 | −0.5 | 0 |
| Select all (n options, exact set) | +1 | −1/n | 0 |
| Type the number (within tolerance) | +1 | −0.25 | 0 |

## Building from source
`index.html` is generated. Edit the files in `src/`, then run:

```bash
python3 src/build.py index.html      # concatenates template + question banks + guide
cd src && node validate.js app.js    # schema checks, KaTeX checks, scoring and selection unit tests
```

| File | Contents |
|---|---|
| `src/template.html` | The engine: UI, scoring, modes, sky, PDF report (shared with [Gradient Galaxy](https://github.com/PedroPCardonaA/gradient-galaxy)) |
| `src/p0.js` … `src/p11.js` | Question banks, one per planet |
| `src/g0.js` … `src/g11.js` | 🧭 Navigation guide cards, one file per planet |
| `src/SPEC.md` | Content spec: planets, question schema, style rules |
| `src/vendor/` | KaTeX 0.16.22 (MIT, `KATEX-LICENSE.txt`) |

## Disclaimer
This is an unofficial study tool and is not affiliated with NTNU. The questions are based on the IDATT2503 exams (2023–2025) and the 2026 crypto assignments. All course material is © NTNU and the course staff. Mistakes are possible, so when in doubt, trust the official solutions.
