# Content spec: Cipher Galaxy (IDATT2503 exam-practice game)

Cipher Galaxy is a single-file HTML quiz game with a space theme, made for the NTNU exam **IDATT2503 Software security and cryptography**. The exam is on **Thu 26 Nov 2026**. It runs in Inspera for 4 h, only a simple calculator is allowed (aids code D), and it is worth about 100 points: 50 software security and 50 cryptography.

The engine is `src/template.html`. Content lives in plain JS files that `build.py` concatenates.

**Only create or edit the files you were assigned.** Do not run `build.py`, because other agents build in parallel and share the output. Check your work with:

```bash
cd src && node validate.js app.js <your files>
```

When you validate only your own files, a few failures are expected:
- `guide missing topic N` for topics that aren't yours;
- `FAIL exam N length` and `FAIL practice N length` while the pool is small.

**Any other error must be fixed.**

## Sources (`../sources/`)
- `IDATT2503 — Kompendium.pdf` (6 pages): exam overview, points per topic for 2023–2025, the cheat sheet and how to answer. **Read it first.** It sets what matters and the style.
- `idatt2503-h2023.pdf`, `idatt2503-h2024.pdf`, `idatt2503-h2025.pdf`: past exams. 2025 includes marking guides and model answers. 2023 and 2024 have no solutions, so **work out and verify every answer yourself**.
- `assignment1.pdf` … `assignment4.pdf`: crypto assignments covering:
  - 1: modular arithmetic, inverses, affine and substitution ciphers;
  - 2: AES history, confusion and diffusion, OTP vs affine vs AES;
  - 3: LFSR periods, HMAC with a toy hash, CBC-MAC;
  - 4: Fermat factorisation, RSA with extended Euclid and square-and-multiply, Pollard p−1, RSA homomorphism and CCA.
- Read PDFs with `pdftotext -layout <file> -`. Code listings, tables and figures sometimes lose their layout, so check those pages visually with the Read tool's `pages` parameter.

## Planets (field `t`)
| t | Planet | Topic |
|---|---|---|
| 0 | Injectia | Web code review: SQLi, command injection, SSTI, XSS, SSRF, path traversal/LFI, XXE, IDOR and missing authorisation, insecure deserialisation, mass assignment, JWT mistakes. Find the bug in a snippet, name it, choose the PoC request, choose the fix. Payload → vulnerability matching. |
| 1 | Cookie Nebula | Web, headers and authentication: security headers, cookie flags, CORS basics, pentest methodology, port scanning (nmap), bug bounty, 2FA and authentication factors, password storage (salt, slow hashes), session handling, the Bash/curl fuzz loop (status code/size differences). |
| 2 | Overflow Prime | Binary exploitation: stack layout, buffer overflow, shellcode, canary/NX/ASLR/PIE/RELRO/FORTIFY with their bypasses, ROP chain construction (padding = buffer + 8, gadget order, dummy pops, syscall last), format-string leaks (%p positions), ret2libc. |
| 3 | Registron | x86-64 assembly tracing: registers, calling convention, syscalls (rax 0/1/59/60, args rdi rsi rdx r10 r8 r9), flags (which instructions set ZF), loops, `mov eax` zero-extension, `lea`, `xor reg,reg`. Mostly `num` questions such as "what is rax / the exit status". |
| 4 | Fuzzing | Fuzzing and sanitizers: coverage-guided fuzzing, libFuzzer harnesses (`LLVMFuzzerTestOneInput`), fuzzing a binary without source, static vs dynamic instrumentation, speeding fuzzing up, corpus/dictionaries, ASan/UBSan/MSan/TSan/LSan and what each finds, the 2024 `ends_with_exam` off-by-one. |
| 5 | Z3-Station | Systems programming and formal verification: OpenSSL API use and mistakes, memory-safe vs unsafe languages (C, C++, Rust, Go), undefined behaviour, Z3/SMT constraint solving, formal verification concepts. |
| 6 | Modulo | Number theory: mod arithmetic, gcd, Euclid and extended Euclid, inverses, Z_n*, Fermat's little theorem, Euler's φ and theorem, reducing exponents, square-and-multiply, order of elements, generators (the test h^((p−1)/r) ≠ 1, φ(p−1) generators). |
| 7 | RSA Major | RSA: key generation, φ(n), choosing e, d via extended Euclid, encryption and decryption, signatures, checking results, why p and q must be large and random, the factoring problem, RSA vs AES and hybrid use. |
| 8 | Factoria | RSA attacks: trial division, Fermat factorisation (p, q close), Pollard p−1 (smooth p−1, choosing B), shared-prime gcd, e = 3 with a small m (cube root), malleability and chosen-ciphertext (y·r^e), textbook-signature forgery, homomorphic property. |
| 9 | Diffie-Hellion | Diffie-Hellman and ElGamal: key exchange calculations, ElGamal encryption, decryption and verification, generators, fresh ephemeral y, malleability, man-in-the-middle on unauthenticated DH, the discrete log problem. |
| 10 | Hashara | Hash functions and MACs: preimage, second preimage and collision resistance, the birthday bound 2^(n/2), Merkle–Damgård and length extension (2024 Crypto 2), HMAC (including the toy calculation from assignment 3), CBC-MAC, MAC vs hash vs signature, encryption vs MAC vs hash vs password hashing (the 2024 table), what a secure MAC must resist. |
| 11 | Caesaria | Symmetric crypto, TLS and classical ciphers: AES facts, confusion and diffusion, modes (ECB, CBC, CTR, GCM/AEAD), IV/nonce reuse, OTP and its reuse, randomness and CSPRNGs (2024 Crypto 5), TLS 1.3 and forward secrecy, hybrid encryption, RSA vs AES (2025 task 5), shift/affine/substitution/Vigenère ciphers and frequency analysis, key-space counting, LFSR periods. |

## Question schema
Each content file is plain JS that pushes into the global array `QB`:

```js
QB.push(
{id:"H25-3.1a", t:7, s:"e25", kind:"single",
 q:["<Norwegian question text (HTML)>", "<English question text (HTML)>"],
 c:"optional code listing, shown verbatim in a code box (single string, not bilingual)",
 o:[["<no>","<en>"], …],                 // 2–6 options as [no, en], all different
 a:2,                                    // index of the correct option (array of indices for multi)
 w:["<why the answer is correct, with the full calculation>", "<English>"],
 x:[["<why this option is wrong / which mistake gives it>","<en>"], …, null, …],  // one per option, null at a
 f:["$d \\equiv e^{-1} \\pmod{\\varphi(n)}$", "$d \\equiv e^{-1} \\pmod{\\varphi(n)}$"]  // formula box (see below)
},
{id:"n7-03", t:7, s:"new", kind:"num",
 q:["…","…"], f:["…","…"], ans:157, tol:0.5, w:["…","…"]},
…
);
```

Kinds:
- `single`: one correct option.
- `tf`: options must be exactly `[["Sant","True"],["Usant","False"]]` and `a` is 0 or 1.
- `multi`: "select all that are true". `a` is an array of indices, and **every** `x` entry is bilingual (explain why each option is true or false; there are no nulls).
- `num`: type a number. Use `ans` and `tol`, with an optional `unit:[no,en]`. There is no `o`, `a` or `x`. Use `tol: 0.5` for integers.

Fields:
- `id`: unique.
  - Real exam questions: `H23-12a`, `H24-14b`, `H25-3.1c`. If one exam task becomes several questions, add letters or numbers.
  - Assignment problems: `A4-2b`.
  - New questions: `n<t>-<nn>`, e.g. `n9-07`.
  - **Never use ids ending in `.c<digits>`.**
- `s`: one of `e23`, `e24`, `e25` (real exam), `assign` (crypto assignment), `new` (new practice question).
- `q`, `o`, `w`, `x`:
  - These are **HTML, not LaTeX**. Use `<code>`, `<b>`, `<sub>`, `<sup>` and Unicode (φ, ≡, ⁻¹, ⊕, ‖).
  - **Escape `<`, `>` and `&` in payloads and code** shown inside them: `&lt;img src=x onerror=alert(1)&gt;`.
  - Longer code goes in `c`, which is escaped automatically.
- `f` and the guide's `f`/`e`/`ex`: text between `$…$` is typeset with KaTeX.
  - Inside those fields, a literal dollar sign must be written as `&#36;`, so the shell payload `$(whoami)` becomes `&#36;(whoami)`.
  - Backslashes must be doubled inside JS strings.
- `f` (formula box): give every calculation question an `f`. Every question with `f` also appears in 🧮 Math mode, so leave `f` off pure theory questions. Write the formula the way the exam would hand it out.

## Style and quality
- **Both languages.** Norwegian (bokmål) first, then English. The 2023/2024 exams are in Norwegian and 2025 is in English. Translate both ways faithfully.
- **Real exam tasks become several questions.** Split each into gradeable sub-questions. Free-text "explain" tasks become `single`/`multi`/`tf` questions whose distractors are the typical wrong answers. Calculations become `num` questions, or `single` with plausible wrong results such as forgetting to reduce mod n, using n instead of φ(n), or an off-by-one in padding.
- **Every distractor gets an `x`** saying exactly why it is wrong or which mistake produces it.
- **`w` teaches.** It shows the full method in the kompendium's style:
  - Euclid as lines `a = q·b + r` followed by back-substitution;
  - square-and-multiply as a table of powers;
  - for attacks: the name, the numbers, why it works and how to prevent it.
  - Keep `w` under about 900 characters per language. Use `<br>` for line breaks.
- **Verify every number with Python.**
  - Write the check scripts in a scratch directory outside the repo and run them with `python3 -I`.
  - For assembly, trace by hand **and** double-check, simulating in Python if needed.
  - A wrong answer key is the worst possible bug.
- **Options are balanced.** Similar length, and the correct answer is not always the longest. Vary the position of `a`.
- **Kind mix per planet:** mostly `single`, plus some `multi` and `tf`. Crypto planets 6–9 get many `num` questions.
- **No figures** (`fig`) are needed. Use `c` for code, assembly, HTTP requests and ROP gadget lists.

## Files
Each planet N has two files, and they belong to the agent that owns that planet:
- `pN.js`, the question bank (`QB.push(...)`);
- `gN.js`, the guide entry (`GUIDE.push({t:N, items:[...]})`).

Validate with `node validate.js app.js pN.js gN.js`.

## Guide (`gN.js`)
Push one entry for your planet:

```js
GUIDE.push({t:7, items:[
 {id:"g-rsa-keygen", n:["RSA-nøkkelgenerering","RSA key generation"],
  f:["$n=pq,\\ \\varphi(n)=(p-1)(q-1),\\ d\\equiv e^{-1}\\pmod{\\varphi(n)}$", "…same…"],
  e:["<what each symbol means, when to use it, typical mistakes (HTML, may contain $…$)>","<en>"],
  ex:["<div class=\"gset\">setup</div><ol class=\"gsteps\"><li>step</li>…</ol><div class=\"gans\"><b>Svar:</b> …</div>", "<en with <b>Answer:</b>>"]},
 …]});
```

- Aim for 4–8 cards per planet, covering every formula, attack, payload class, protection and register rule from the kompendium's cheat sheet for that planet.
- Worked examples (`ex`) are required for calculation cards and optional for fact cards.
- Card `id`s start with `g-` and are unique.

## Targets
- 15–25 questions per planet.
- Include **every** relevant past-exam task (2023, 2024, 2025) and every relevant assignment problem, then fill the rest with new questions in the same style.
- The planets the kompendium says score most get the upper end of the range:
  - RSA and attacks;
  - DH/ElGamal;
  - web code review;
  - ROP;
  - assembly;
  - fuzzing.
