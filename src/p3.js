// Planet 3: Registron, x86-64 assembly tracing (Intel syntax). Every trace verified with a Python register-machine simulator.
QB.push(

// ===================== Real exam tasks =====================
{id:"H23-7a", t:3, s:"e23", kind:"single",
 q:["Gitt følgende assemblykode. Hva blir utskriften når programmet kjøres?","Given the following assembly code. What is printed when the program runs?"],
 c:`section .data
  msg: db "Hello", 10

section .text

global _start

_start:
  mov rcx, 1
  dec rcx
  jnz exit
  mov rax, 1          ; The system call for write
  mov rdi, 1          ; File descriptor 1 - standard output
  mov rsi, msg
  mov rdx, 2
  syscall

exit:
  mov rax, 60         ; The system call for exit (sys_exit)
  mov rdi, 10
  syscall`,
 o:[["&quot;Hello\\n&quot; (\\n er linjeskift)","&quot;Hello\\n&quot; (\\n is newline)"],["&quot;&quot; (ingen utskrift)","&quot;&quot; (no output)"],["&quot;He&quot;","&quot;He&quot;"],["&quot;Hello&quot;","&quot;Hello&quot;"]],
 a:2,
 f:["$\\texttt{write}:\\ rax=1,\\ rdi=fd,\\ rsi=buf,\\ rdx=len$","$\\texttt{write}:\\ rax=1,\\ rdi=fd,\\ rsi=buf,\\ rdx=len$"],
 w:["Sporing:<br>1. <code>mov rcx, 1</code> → rcx = 1.<br>2. <code>dec rcx</code> → rcx = 0, så <b>ZF = 1</b>.<br>3. <code>jnz exit</code> hopper bare når ZF = 0 → hopper <b>ikke</b>.<br>4. write(fd = 1, buf = msg, len = <b>rdx = 2</b>) skriver de 2 første bytene: <b>&quot;He&quot;</b>.<br>5. exit(rdi = 10).<br>Lengden bestemmes av rdx, ikke av strengen.",
    "Trace:<br>1. <code>mov rcx, 1</code> → rcx = 1.<br>2. <code>dec rcx</code> → rcx = 0, so <b>ZF = 1</b>.<br>3. <code>jnz exit</code> jumps only when ZF = 0 → does <b>not</b> jump.<br>4. write(fd = 1, buf = msg, len = <b>rdx = 2</b>) prints the first 2 bytes: <b>&quot;He&quot;</b>.<br>5. exit(rdi = 10).<br>The length comes from rdx, not from the string."],
 x:[["Hele strengen er 6 byte, men rdx = 2 begrenser write til 2 byte.","The whole string is 6 bytes, but rdx = 2 limits write to 2 bytes."],
    ["Det får du hvis du tror <code>jnz</code> hopper når resultatet er 0. dec gir 0 → ZF = 1 → jnz hopper ikke.","You get this if you think <code>jnz</code> jumps when the result is 0. dec gives 0 → ZF = 1 → jnz does not jump."],
    null,
    ["«Hello» er 5 byte; rdx = 2, så bare «He» skrives.","“Hello” is 5 bytes; rdx = 2, so only “He” is written."]]},

{id:"H23-7b", t:3, s:"e23", kind:"num",
 q:["Samme program som over (H23 oppgave 7). Hva blir <code>exit status</code> når programmet avslutter?","Same program as above (H23 task 7). What is the <code>exit status</code> when the program ends?"],
 c:`_start:
  mov rcx, 1
  dec rcx
  jnz exit
  mov rax, 1          ; write
  mov rdi, 1          ; stdout
  mov rsi, msg
  mov rdx, 2
  syscall

exit:
  mov rax, 60         ; exit
  mov rdi, 10
  syscall`,
 ans:10, tol:0.5,
 f:["$\\texttt{exit}:\\ rax=60,\\ \\text{status}=rdi \\bmod 256$","$\\texttt{exit}:\\ rax=60,\\ \\text{status}=rdi \\bmod 256$"],
 w:["exit-kallet bruker <b>rdi</b> som status. Rett før <code>syscall</code> settes <code>mov rdi, 10</code>, så status = <b>10</b>.<br>Feller: 60 er syscall-nummeret (rax), 1 er fd-en fra write, 2 er rax etter write (antall byte), og 0 får du bare med <code>xor rdi, rdi</code>.",
    "The exit call uses <b>rdi</b> as the status. Right before <code>syscall</code>, <code>mov rdi, 10</code> runs, so status = <b>10</b>.<br>Traps: 60 is the syscall number (rax), 1 is the fd from write, 2 is rax after write (bytes written), and 0 only comes from <code>xor rdi, rdi</code>."]},

{id:"H24-7a", t:3, s:"e24", kind:"num",
 q:["Gitt følgende assemblykode. Når programmet kjøres blir utskriften: ___ (skriv sifrene som ett tall, f.eks. 12)","Given the following assembly code. When the program runs, the output is: ___ (type the digits as one number, e.g. 12)"],
 c:`section .data
  msg: db "123456789"
section .text
global _start
_start:
  mov rcx, 2
top:
  dec rcx
  push rcx
  mov rax, 1          ; The system call for write
  mov rdi, 2          ; File descriptor 2 - standard error
  mov rsi, msg
  mov rdx, rdi
  syscall
  pop rcx
  jnz top
  mov rax, 60         ; The system call for exit (sys_exit)
  mov rdi, rax
  syscall`,
 ans:1212, tol:0.5,
 f:["$\\texttt{syscall}:\\ rcx \\leftarrow rip,\\ r11 \\leftarrow rflags;\\ \\texttt{push/pop/mov}\\ \\text{endrer ikke ZF}$","$\\texttt{syscall}:\\ rcx \\leftarrow rip,\\ r11 \\leftarrow rflags;\\ \\texttt{push/pop/mov}\\ \\text{leave ZF alone}$"],
 w:["Sporingstabell (bare <code>dec</code> setter ZF):<br>Runde 1: rcx 2→1, ZF = 0. push 1. write(2, msg, rdx = rdi = <b>2</b>) → «12». syscall ødelegger rcx, men pop gir rcx = 1. jnz: ZF = 0 → hopp.<br>Runde 2: rcx 1→0, ZF = 1. push 0. write → «12». pop → rcx = 0. jnz: ZF = 1 → ferdig.<br>Utskrift: <b>1212</b> (på stderr). Feller: <code>mov rdx, rdi</code> gir lengde 2, ikke 9; push/pop redder rcx fra syscall; syscall bevarer flaggene (RFLAGS lagres i r11 og settes tilbake).",
    "Trace table (only <code>dec</code> sets ZF):<br>Pass 1: rcx 2→1, ZF = 0. push 1. write(2, msg, rdx = rdi = <b>2</b>) → “12”. syscall clobbers rcx, but pop gives rcx = 1. jnz: ZF = 0 → jump.<br>Pass 2: rcx 1→0, ZF = 1. push 0. write → “12”. pop → rcx = 0. jnz: ZF = 1 → done.<br>Output: <b>1212</b> (on stderr). Traps: <code>mov rdx, rdi</code> gives length 2, not 9; push/pop saves rcx from syscall; syscall keeps the flags (RFLAGS is saved in r11 and restored)."]},

{id:"H24-7b", t:3, s:"e24", kind:"num",
 q:["Samme program som over (H24 oppgave 7). Når programmet avsluttes blir <code>exit status</code>: ___","Same program as above (H24 task 7). When the program ends, the <code>exit status</code> is: ___"],
 c:`  ...
  pop rcx
  jnz top
  mov rax, 60         ; The system call for exit (sys_exit)
  mov rdi, rax
  syscall`,
 ans:60, tol:0.5,
 f:["$\\text{status}=rdi\\ \\text{når exit kjører}$","$\\text{status}=rdi\\ \\text{when exit runs}$"],
 w:["Rekkefølgen teller: først <code>mov rax, 60</code>, så <code>mov rdi, rax</code> kopierer 60 inn i rdi. exit(rdi) gir status <b>60</b>.<br>Feller: 2 er rax etter siste write (antall byte) – men rax er allerede overskrevet med 60 før kopien. 0 er rcx etter løkka.",
    "Order matters: first <code>mov rax, 60</code>, then <code>mov rdi, rax</code> copies 60 into rdi. exit(rdi) gives status <b>60</b>.<br>Traps: 2 is rax after the last write (bytes written) – but rax was already overwritten with 60 before the copy. 0 is rcx after the loop."]},

{id:"H25-1.4a", t:3, s:"e25", kind:"single",
 q:["Gitt følgende assemblykode. Hva blir <b>utskriften</b>?","Given the following assembly code. What is the <b>output</b>?"],
 c:`section .data
  msg: db "123456789"
section .text
global _start
_start:
  mov rdx, 2
top:
  mov rax, 1           ; The system call for write
  mov rdi, 2           ; File descriptor 2 - standard error
  mov rsi, msg
  push rdx
  syscall
  inc rdx
  pop rdx
  dec rdx
  mov rcx, rdx
  jnz top
  mov rax, 60          ; The system call for exit (sys_exit)
  xor rdi, rdi
  syscall`,
 o:[["12","12"],["1212","1212"],["121","121"],["1","1"],["123","123"],["Uendelig utskrift","Infinite output"]],
 a:2,
 f:["$\\texttt{write}(2,\\ msg,\\ rdx)\\ \\Rightarrow\\ \\text{skriver } rdx \\text{ byte}$","$\\texttt{write}(2,\\ msg,\\ rdx)\\ \\Rightarrow\\ \\text{prints } rdx \\text{ bytes}$"],
 w:["Sporing:<br>Runde 1: rdx = 2. push 2. write(2, msg, 2) → «12». <code>inc rdx</code> → 3, men <code>pop rdx</code> henter 2 tilbake. <code>dec rdx</code> → 1, ZF = 0. <code>mov rcx, rdx</code> endrer ikke flagg. jnz → hopp.<br>Runde 2: rdx = 1. write(2, msg, 1) → «1». inc → 2, pop → 1, dec → 0, ZF = 1. jnz hopper ikke.<br>Utskrift: <b>121</b>, deretter exit(0).",
    "Trace:<br>Pass 1: rdx = 2. push 2. write(2, msg, 2) → “12”. <code>inc rdx</code> → 3, but <code>pop rdx</code> restores 2. <code>dec rdx</code> → 1, ZF = 0. <code>mov rcx, rdx</code> does not touch flags. jnz → jump.<br>Pass 2: rdx = 1. write(2, msg, 1) → “1”. inc → 2, pop → 1, dec → 0, ZF = 1. jnz does not jump.<br>Output: <b>121</b>, then exit(0)."],
 x:[["Bare første runde. dec gir 1 (ikke 0), så løkka kjører én gang til.","Only the first pass. dec gives 1 (not 0), so the loop runs once more."],
    ["Dette er H24-svaret der lengden alltid er 2. Her krymper rdx til 1 i runde 2.","That is the H24 answer where the length is always 2. Here rdx shrinks to 1 in pass 2."],
    null,
    ["Glemmer første runde med lengde 2.","Forgets the first pass with length 2."],
    ["Får du hvis du tror <code>inc rdx</code> overlever – men <code>pop rdx</code> overskriver den.","You get this if you think <code>inc rdx</code> survives – but <code>pop rdx</code> overwrites it."],
    ["rdx går 2 → 1 → 0, og dec setter ZF = 1 ved 0, så løkka stopper.","rdx goes 2 → 1 → 0, and dec sets ZF = 1 at 0, so the loop stops."]]},

{id:"H25-1.4b", t:3, s:"e25", kind:"num",
 q:["Samme program som over (H25 oppgave 1.4). Hva blir <b>exit status</b>?","Same program as above (H25 task 1.4). What is the <b>exit status</b>?"],
 c:`  ...
  mov rcx, rdx
  jnz top
  mov rax, 60          ; The system call for exit (sys_exit)
  xor rdi, rdi
  syscall`,
 ans:0, tol:0.5,
 f:["$\\texttt{xor rdi, rdi} \\Rightarrow rdi=0$","$\\texttt{xor rdi, rdi} \\Rightarrow rdi=0$"],
 w:["<code>xor rdi, rdi</code> gir alltid 0 (x ⊕ x = 0), og exit bruker rdi som status → <b>0</b>.<br>Feller: 2 er fd-en (rdi i løkka) og 1 er rax etter siste write, men begge overskrives før exit.",
    "<code>xor rdi, rdi</code> always gives 0 (x ⊕ x = 0), and exit uses rdi as the status → <b>0</b>.<br>Traps: 2 is the fd (rdi inside the loop) and 1 is rax after the last write, but both are overwritten before exit."]},

// ===================== New trace exercises =====================
{id:"n3-01", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .data
  msg: db "Hei IDATT2503", 10
section .text
global _start
_start:
  mov rax, 1          ; write
  mov rdi, 1          ; stdout
  mov rsi, msg
  mov rdx, 7
  syscall
  mov rdi, rax
  mov rax, 60         ; exit
  syscall`,
 ans:7, tol:0.5,
 f:["$\\texttt{write}\\ \\text{returnerer antall byte skrevet i } rax$","$\\texttt{write}\\ \\text{returns the number of bytes written in } rax$"],
 w:["write(1, msg, 7) skriver «Hei IDA» og <b>returnerer antall byte i rax</b> = 7. <code>mov rdi, rax</code> → rdi = 7, så exit(7).<br>Feller: 14 er hele strengens lengde (rdx bestemmer), 1 er fd/syscall-nummeret, 60 er exit-nummeret som settes <i>etter</i> kopien.",
    "write(1, msg, 7) prints “Hei IDA” and <b>returns the byte count in rax</b> = 7. <code>mov rdi, rax</code> → rdi = 7, so exit(7).<br>Traps: 14 is the full string length (rdx decides), 1 is the fd/syscall number, 60 is the exit number set <i>after</i> the copy."]},

{id:"n3-02", t:3, s:"new", kind:"single",
 q:["Hvor mange ganger skrives «AB» ut?","How many times is “AB” printed?"],
 c:`section .data
  msg: db "AB"
section .text
global _start
_start:
  mov rcx, 3
top:
  mov rax, 1
  mov rdi, 1
  mov rsi, msg
  mov rdx, 2
  syscall
  dec rcx
  jnz top
  mov rax, 60
  xor rdi, rdi
  syscall`,
 o:[["3 ganger","3 times"],["2 ganger","2 times"],["1 gang","once"],["Uendelig mange (løkka stopper aldri)","Forever (the loop never ends)"]],
 a:3,
 f:["$\\texttt{syscall}:\\ rcx \\leftarrow rip,\\ r11 \\leftarrow rflags$","$\\texttt{syscall}:\\ rcx \\leftarrow rip,\\ r11 \\leftarrow rflags$"],
 w:["<code>syscall</code> lagrer returadressen (rip) i <b>rcx</b> og RFLAGS i <b>r11</b>. Etter hver write er rcx derfor adressen til <code>dec rcx</code> (et stort tall), og dec gir aldri 0. Hver runde setter syscall rcx tilbake til samme adresse → <b>uendelig løkke</b>.<br>Fiks: <code>push rcx</code>/<code>pop rcx</code> rundt syscall (som i H24), eller bruk et register syscall ikke rører, f.eks. rbx eller r12.",
    "<code>syscall</code> stores the return address (rip) in <b>rcx</b> and RFLAGS in <b>r11</b>. After every write, rcx is the address of <code>dec rcx</code> (a big number), and dec never reaches 0. Each pass syscall resets rcx to the same address → <b>infinite loop</b>.<br>Fix: <code>push rcx</code>/<code>pop rcx</code> around syscall (as in H24), or use a register syscall leaves alone, e.g. rbx or r12."],
 x:[["Stemmer bare hvis rcx overlever syscall. Det gjør den ikke: syscall skriver rip inn i rcx.","Only true if rcx survived syscall. It does not: syscall writes rip into rcx."],
    ["Off-by-one-tenking på telleren, og rcx overlever uansett ikke syscall.","Off-by-one thinking about the counter, and rcx does not survive syscall anyway."],
    ["Får du hvis du tror syscall nullstiller rcx. Den setter rcx = returadressen, som ikke er 1.","You get this if you think syscall zeroes rcx. It sets rcx = the return address, which is not 1."],
    null]},

{id:"n3-03", t:3, s:"new", kind:"num",
 q:["Hva er verdien i <b>rax</b> (desimalt) etter <code>mov eax, 7</code>?","What is the value in <b>rax</b> (decimal) after <code>mov eax, 7</code>?"],
 c:`  mov rax, -1          ; rax = 0xFFFFFFFFFFFFFFFF
  mov eax, 7
  ; rax = ?`,
 ans:7, tol:0.5,
 f:["$\\texttt{mov eax},x \\Rightarrow rax = x\\ (\\text{øvre 32 bit} = 0)$","$\\texttt{mov eax},x \\Rightarrow rax = x\\ (\\text{upper 32 bits} = 0)$"],
 w:["Å skrive til et <b>32-bit</b>-register (eax) <b>nullstiller de øvre 32 bitene</b> av rax (zero-extension). Altså rax = 0x0000000000000007 = <b>7</b>.<br>Felle: å tro at rax blir 0xFFFFFFFF00000007. Det gjelder bare ikke for 32-bit; men <code>mov ax, 7</code> eller <code>mov al, 7</code> (16/8 bit) beholder de øvre bitene.",
    "Writing a <b>32-bit</b> register (eax) <b>clears the upper 32 bits</b> of rax (zero extension). So rax = 0x0000000000000007 = <b>7</b>.<br>Trap: thinking rax becomes 0xFFFFFFFF00000007. That does not happen for 32-bit writes; but <code>mov ax, 7</code> or <code>mov al, 7</code> (16/8 bit) keep the upper bits."]},

{id:"n3-04", t:3, s:"new", kind:"num",
 q:["Hva er verdien i <b>rax</b> etter koden? Svar desimalt.","What is the value in <b>rax</b> after the code? Answer in decimal."],
 c:`  mov rax, 0x1234
  mov al, 0x01
  ; rax = ?`,
 ans:4609, tol:0.5,
 f:["$\\texttt{mov al},x:\\ \\text{bare laveste byte endres}$","$\\texttt{mov al},x:\\ \\text{only the lowest byte changes}$"],
 w:["<code>al</code> er den laveste byten av rax. En 8-bit-skriving endrer <b>bare</b> den byten; resten beholdes (ingen zero-extension, den gjelder bare 32-bit).<br>0x1234 → bytt ut 0x34 med 0x01 → <b>0x1201</b> = 1·4096 + 2·256 + 0·16 + 1 = <b>4609</b>.<br>Feller: 1 (tror hele rax nullstilles som ved <code>mov eax</code>), 4660 = 0x1234 (tror ingenting endres).",
    "<code>al</code> is the lowest byte of rax. An 8-bit write changes <b>only</b> that byte; the rest is kept (no zero extension, that only applies to 32-bit).<br>0x1234 → replace 0x34 with 0x01 → <b>0x1201</b> = 1·4096 + 2·256 + 0·16 + 1 = <b>4609</b>.<br>Traps: 1 (thinking all of rax is cleared as with <code>mov eax</code>), 4660 = 0x1234 (thinking nothing changes)."]},

{id:"n3-05", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .text
global _start
_start:
  mov rcx, 1
  dec rcx
  lea rdi, [rcx+7]
  jz done
  mov rdi, 3
done:
  mov rax, 60
  syscall`,
 ans:7, tol:0.5,
 f:["$\\texttt{lea}\\ \\text{regner ut adressen, endrer ikke flagg}$","$\\texttt{lea}\\ \\text{computes the address, leaves flags alone}$"],
 w:["1. <code>dec rcx</code> → rcx = 0, <b>ZF = 1</b>.<br>2. <code>lea rdi, [rcx+7]</code> → rdi = 0 + 7 = 7. lea leser ikke minnet og <b>endrer ikke flaggene</b>.<br>3. <code>jz done</code> ser fortsatt ZF = 1 fra dec → hopper over <code>mov rdi, 3</code>.<br>4. exit(rdi = <b>7</b>).<br>Felle: 3 får du hvis du tror lea satte ZF = 0 fordi resultatet 7 ≠ 0.",
    "1. <code>dec rcx</code> → rcx = 0, <b>ZF = 1</b>.<br>2. <code>lea rdi, [rcx+7]</code> → rdi = 0 + 7 = 7. lea does not read memory and <b>does not change the flags</b>.<br>3. <code>jz done</code> still sees ZF = 1 from dec → skips <code>mov rdi, 3</code>.<br>4. exit(rdi = <b>7</b>).<br>Trap: 3 comes from thinking lea set ZF = 0 because the result 7 ≠ 0."]},

{id:"n3-06", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .text
global _start
_start:
  xor eax, eax
  mov ecx, 5
top:
  add eax, ecx
  dec ecx
  jnz top
  mov edi, eax
  mov eax, 60
  syscall`,
 ans:15, tol:0.5,
 f:["$\\text{løkke: } eax = 5+4+3+2+1$","$\\text{loop: } eax = 5+4+3+2+1$"],
 w:["Sporingstabell (dec setter ZF):<br>ecx 5: eax = 5, ecx → 4<br>ecx 4: eax = 9, ecx → 3<br>ecx 3: eax = 12, ecx → 2<br>ecx 2: eax = 14, ecx → 1<br>ecx 1: eax = 15, ecx → 0, ZF = 1 → ut av løkka.<br>edi = 15 → exit status <b>15</b>. (32-bit-registre er greit her; <code>mov edi, eax</code> nuller de øvre bitene av rdi.)<br>Felle: 10 (glemmer siste runde med ecx = 1) eller 14.",
    "Trace table (dec sets ZF):<br>ecx 5: eax = 5, ecx → 4<br>ecx 4: eax = 9, ecx → 3<br>ecx 3: eax = 12, ecx → 2<br>ecx 2: eax = 14, ecx → 1<br>ecx 1: eax = 15, ecx → 0, ZF = 1 → leave the loop.<br>edi = 15 → exit status <b>15</b>. (32-bit registers are fine here; <code>mov edi, eax</code> clears the upper bits of rdi.)<br>Trap: 10 (forgetting the last pass with ecx = 1) or 14."]},

{id:"n3-07", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .text
global _start
_start:
  xor rdi, rdi
  xor rcx, rcx
top:
  add rdi, 3
  inc rcx
  cmp rcx, 4
  jl top
  mov rax, 60
  syscall`,
 ans:12, tol:0.5,
 f:["$\\texttt{cmp a,b}:\\ \\text{flagg fra } a-b;\\ \\texttt{jl}: a<b\\ (\\text{signert})$","$\\texttt{cmp a,b}:\\ \\text{flags from } a-b;\\ \\texttt{jl}: a<b\\ (\\text{signed})$"],
 w:["<code>cmp rcx, 4</code> regner rcx − 4 uten å lagre; <code>jl</code> hopper når rcx &lt; 4.<br>rcx = 1: rdi = 3, 1 &lt; 4 → hopp<br>rcx = 2: rdi = 6 → hopp<br>rcx = 3: rdi = 9 → hopp<br>rcx = 4: rdi = 12, 4 &lt; 4 er usant → ferdig.<br>exit status <b>12</b>. Felle: 9 eller 15 (off-by-one fordi inc skjer <i>før</i> cmp).",
    "<code>cmp rcx, 4</code> computes rcx − 4 without storing it; <code>jl</code> jumps while rcx &lt; 4.<br>rcx = 1: rdi = 3, 1 &lt; 4 → jump<br>rcx = 2: rdi = 6 → jump<br>rcx = 3: rdi = 9 → jump<br>rcx = 4: rdi = 12, 4 &lt; 4 is false → done.<br>exit status <b>12</b>. Trap: 9 or 15 (off-by-one because inc runs <i>before</i> cmp)."]},

{id:"n3-08", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .text
global _start
_start:
  mov rax, 3
  shl rax, 4
  imul rax, rax, 3
  shr rax, 2
  mov rdi, rax
  mov rax, 60
  syscall`,
 ans:36, tol:0.5,
 f:["$\\texttt{shl}\\ x,k = x\\cdot 2^k,\\quad \\texttt{shr}\\ x,k = \\lfloor x/2^k \\rfloor$","$\\texttt{shl}\\ x,k = x\\cdot 2^k,\\quad \\texttt{shr}\\ x,k = \\lfloor x/2^k \\rfloor$"],
 w:["1. rax = 3<br>2. <code>shl rax, 4</code> → 3 · 2⁴ = 48<br>3. <code>imul rax, rax, 3</code> (tre operander: rax = rax · 3) → 144<br>4. <code>shr rax, 2</code> → ⌊144 / 4⌋ = 36<br>5. rdi = 36 → exit status <b>36</b>.<br>Feller: 12 (shl 4 lest som ·4), 144 (glemmer shr), 9 (shr 4 i stedet for 2).",
    "1. rax = 3<br>2. <code>shl rax, 4</code> → 3 · 2⁴ = 48<br>3. <code>imul rax, rax, 3</code> (three operands: rax = rax · 3) → 144<br>4. <code>shr rax, 2</code> → ⌊144 / 4⌋ = 36<br>5. rdi = 36 → exit status <b>36</b>.<br>Traps: 12 (reading shl 4 as ·4), 144 (forgetting shr), 9 (shr 4 instead of 2)."]},

{id:"n3-09", t:3, s:"new", kind:"num",
 q:["Hva blir exit status (det skallet viser i <code>echo &#36;?</code>)?","What is the exit status (what the shell shows in <code>echo &#36;?</code>)?"],
 c:`section .text
global _start
_start:
  mov rdi, 100
  lea rdi, [rdi+rdi*2]
  mov rax, 60
  syscall`,
 ans:44, tol:0.5,
 f:["$\\text{status} = rdi \\bmod 256$","$\\text{status} = rdi \\bmod 256$"],
 w:["<code>lea rdi, [rdi+rdi*2]</code> er en vanlig gange-med-3-triks: rdi = 100 + 200 = 300 (ingen minnetilgang).<br>Exit status er bare de <b>laveste 8 bitene</b> av rdi: 300 mod 256 = <b>44</b>.<br>Felle: 300 (glemmer at status er én byte) eller 200 (leser [rdi*2] uten +rdi).",
    "<code>lea rdi, [rdi+rdi*2]</code> is a common multiply-by-3 trick: rdi = 100 + 200 = 300 (no memory access).<br>The exit status is only the <b>lowest 8 bits</b> of rdi: 300 mod 256 = <b>44</b>.<br>Trap: 300 (forgetting the status is one byte) or 200 (reading [rdi*2] without +rdi)."]},

{id:"n3-10", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .data
  msg: db "abcdef"
section .text
global _start
_start:
  xor rbx, rbx
  mov r12, 4
top:
  mov rax, 1
  mov rdi, 1
  mov rsi, msg
  mov rdx, 3
  syscall
  add rbx, rax
  dec r12
  jnz top
  mov rdi, rbx
  mov rax, 60
  syscall`,
 ans:12, tol:0.5,
 f:["$\\text{status} = \\sum \\text{returverdier fra write} = \\text{runder}\\cdot rdx$","$\\text{status} = \\sum \\text{write return values} = \\text{passes}\\cdot rdx$"],
 w:["r12 er teller og overlever syscall (bare rcx og r11 ødelegges). Løkka går 4 ganger (r12 4→3→2→1→0).<br>Hver write(1, msg, 3) skriver «abc» og returnerer <b>rax = 3</b>; <code>add rbx, rax</code> summerer: 3, 6, 9, 12.<br>Utskrift «abcabcabcabc», exit status <b>12</b>.<br>Feller: 4 (antall runder), 6 (strenglengden), 24.",
    "r12 is the counter and survives syscall (only rcx and r11 are clobbered). The loop runs 4 times (r12 4→3→2→1→0).<br>Each write(1, msg, 3) prints “abc” and returns <b>rax = 3</b>; <code>add rbx, rax</code> accumulates: 3, 6, 9, 12.<br>Output “abcabcabcabc”, exit status <b>12</b>.<br>Traps: 4 (number of passes), 6 (string length), 24."]},

{id:"n3-11", t:3, s:"new", kind:"num",
 q:["Hva blir exit status? (System V-kallkonvensjonen gjelder.)","What is the exit status? (The System V calling convention applies.)"],
 c:`section .text
global _start
_start:
  mov rdi, 6
  mov rsi, 7
  call muladd
  mov rdi, rax
  mov rax, 60
  syscall

muladd:
  mov rax, rdi
  imul rax, rsi
  add rax, 1
  ret`,
 ans:43, tol:0.5,
 f:["$f(rdi,\\ rsi,\\ rdx,\\ rcx,\\ r8,\\ r9) \\Rightarrow rax$","$f(rdi,\\ rsi,\\ rdx,\\ rcx,\\ r8,\\ r9) \\Rightarrow rax$"],
 w:["Kallkonvensjon: 1. argument i rdi, 2. i rsi, returverdi i <b>rax</b>.<br><code>muladd(6, 7)</code>: rax = 6 → <code>imul rax, rsi</code> → 42 → <code>add rax, 1</code> → 43 → <code>ret</code>.<br>Tilbake i _start: rdi = rax = 43 → exit status <b>43</b>.<br>Feller: 6 (bruker rdi uten å se at den overskrives med rax), 42 (glemmer +1), 60.",
    "Calling convention: 1st argument in rdi, 2nd in rsi, return value in <b>rax</b>.<br><code>muladd(6, 7)</code>: rax = 6 → <code>imul rax, rsi</code> → 42 → <code>add rax, 1</code> → 43 → <code>ret</code>.<br>Back in _start: rdi = rax = 43 → exit status <b>43</b>.<br>Traps: 6 (using rdi without seeing it is overwritten by rax), 42 (forgetting +1), 60."]},

{id:"n3-12", t:3, s:"new", kind:"num",
 q:["Hva blir exit status?","What is the exit status?"],
 c:`section .text
global _start
_start:
  mov rax, 2
  sub rax, 5
  mov rdi, rax
  mov rax, 60
  syscall`,
 ans:253, tol:0.5,
 f:["$-3 \\equiv 2^{64}-3;\\quad \\text{status}=rdi \\bmod 256 = 256-3$","$-3 \\equiv 2^{64}-3;\\quad \\text{status}=rdi \\bmod 256 = 256-3$"],
 w:["2 − 5 = −3. I 64 bit er det 0xFFFFFFFFFFFFFFFD (toerkomplement, 2⁶⁴ − 3).<br>Exit status er den laveste byten: 0xFD = <b>253</b> (= 256 − 3).<br>Felle: −3 (status er alltid 0–255) eller 3.",
    "2 − 5 = −3. In 64 bits that is 0xFFFFFFFFFFFFFFFD (two's complement, 2⁶⁴ − 3).<br>The exit status is the lowest byte: 0xFD = <b>253</b> (= 256 − 3).<br>Trap: −3 (the status is always 0–255) or 3."]},

{id:"n3-13", t:3, s:"new", kind:"single",
 q:["Hva skrives ut?","What is printed?"],
 c:`section .data
  msg: db "ABCDEFGH"
section .text
global _start
_start:
  mov rax, 1
  mov rdi, 1
  lea rsi, [msg+3]
  mov rdx, 2
  syscall
  mov rax, 60
  mov rdi, 0
  syscall`,
 o:[["CD","CD"],["AB","AB"],["DEF","DEF"],["DE","DE"],["ABC","ABC"]],
 a:3,
 f:["$rsi = msg + 3\\ \\text{(0-indeksert)},\\ rdx = 2$","$rsi = msg + 3\\ \\text{(0-indexed)},\\ rdx = 2$"],
 w:["<code>lea rsi, [msg+3]</code> gir adressen 3 byte inn i strengen. Med 0-indeksering: A = 0, B = 1, C = 2, <b>D = 3</b>.<br>write(1, msg+3, 2) skriver 2 byte fra D: <b>«DE»</b>.<br>lea regner bare ut adressen; den leser ikke minnet.",
    "<code>lea rsi, [msg+3]</code> gives the address 3 bytes into the string. With 0-indexing: A = 0, B = 1, C = 2, <b>D = 3</b>.<br>write(1, msg+3, 2) prints 2 bytes starting at D: <b>“DE”</b>.<br>lea only computes the address; it does not read memory."],
 x:[["Teller fra 1 i stedet for 0 (C er offset 2).","Counts from 1 instead of 0 (C is offset 2)."],
    ["Ignorerer +3; da ville rsi = msg.","Ignores +3; that would be rsi = msg."],
    ["Riktig start, men rdx = 2 gir bare 2 byte.","Right start, but rdx = 2 gives only 2 bytes."],
    null,
    ["Tar 3 som lengde og glemmer offset.","Takes 3 as the length and forgets the offset."]]},

{id:"n3-14", t:3, s:"new", kind:"single",
 q:["En C-funksjon <code>long f(long a, long b, long c, long d)</code> kalles på Linux x86-64 (System V-ABI). I hvilket register ligger <code>d</code>?","A C function <code>long f(long a, long b, long c, long d)</code> is called on Linux x86-64 (System V ABI). Which register holds <code>d</code>?"],
 o:[["rdx","rdx"],["r10","r10"],["rcx","rcx"],["r8","r8"],["På stacken","On the stack"]],
 a:2,
 w:["Funksjonskall: argumentene går i <b>rdi, rsi, rdx, rcx, r8, r9</b>, deretter stacken; returverdi i rax. a = rdi, b = rsi, c = rdx, <b>d = rcx</b>.<br>Syscall bruker nesten samme rekkefølge, men med <b>r10 i stedet for rcx</b> som 4. argument, fordi syscall-instruksjonen selv overskriver rcx (returadresse) og r11 (RFLAGS).",
    "Function calls: arguments go in <b>rdi, rsi, rdx, rcx, r8, r9</b>, then the stack; return value in rax. a = rdi, b = rsi, c = rdx, <b>d = rcx</b>.<br>Syscalls use almost the same order, but with <b>r10 instead of rcx</b> as the 4th argument, because the syscall instruction itself overwrites rcx (return address) and r11 (RFLAGS)."],
 x:[["rdx er 3. argument (c).","rdx is the 3rd argument (c)."],
    ["r10 er 4. argument for <i>syscall</i>, ikke for vanlige funksjonskall.","r10 is the 4th argument for <i>syscalls</i>, not for ordinary function calls."],
    null,
    ["r8 er 5. argument.","r8 is the 5th argument."],
    ["Stacken brukes først fra 7. argument; de 6 første går i registre.","The stack is used only from the 7th argument; the first 6 go in registers."]]},

{id:"n3-15", t:3, s:"new", kind:"multi",
 q:["Hvilke av instruksjonene under <b>oppdaterer ZF</b> (nullflagget)? Velg alle som stemmer.","Which of the instructions below <b>update ZF</b> (the zero flag)? Select all that apply."],
 o:[["<code>dec rcx</code>","<code>dec rcx</code>"],["<code>mov rcx, 0</code>","<code>mov rcx, 0</code>"],["<code>xor eax, eax</code>","<code>xor eax, eax</code>"],["<code>lea rax, [rax+1]</code>","<code>lea rax, [rax+1]</code>"],["<code>test rax, rax</code>","<code>test rax, rax</code>"],["<code>pop rcx</code>","<code>pop rcx</code>"],["<code>cmp rcx, 4</code>","<code>cmp rcx, 4</code>"]],
 a:[0,2,4,6],
 w:["Aritmetikk og logikk setter flagg: <b>add, sub, inc, dec, xor, and, or, cmp, test</b>. cmp = sub uten å lagre, test = and uten å lagre.<br>Dataflytting setter <b>ikke</b> flagg: <b>mov, push, pop, lea, jmp</b> (og call/ret).<br>Derfor ser en <code>jnz</code> alltid på den <i>siste flaggsettende</i> instruksjonen, ikke nødvendigvis linja rett over.",
    "Arithmetic and logic set flags: <b>add, sub, inc, dec, xor, and, or, cmp, test</b>. cmp = sub without storing, test = and without storing.<br>Data movement does <b>not</b> set flags: <b>mov, push, pop, lea, jmp</b> (and call/ret).<br>So a <code>jnz</code> always looks at the <i>last flag-setting</i> instruction, not necessarily the line right above it."],
 x:[["Sant: dec setter ZF (men ikke CF).","True: dec sets ZF (but not CF)."],
    ["Usant: mov endrer aldri flagg, selv om verdien er 0. Bruk <code>xor rcx, rcx</code> eller <code>test</code> om du vil ha ZF.","False: mov never changes flags, even when the value is 0. Use <code>xor rcx, rcx</code> or <code>test</code> if you want ZF."],
    ["Sant: xor setter ZF (her alltid 1, siden x ⊕ x = 0) og nuller CF/OF.","True: xor sets ZF (here always 1, since x ⊕ x = 0) and clears CF/OF."],
    ["Usant: lea regner bare ut en adresse og rører ikke flaggene.","False: lea only computes an address and leaves the flags alone."],
    ["Sant: test gjør rax AND rax og setter ZF = 1 hvis rax = 0.","True: test does rax AND rax and sets ZF = 1 if rax = 0."],
    ["Usant: pop henter fra stacken uten å sette flagg (derfor virker H24-løkka).","False: pop loads from the stack without setting flags (that is why the H24 loop works)."],
    ["Sant: cmp regner rcx − 4 og setter ZF, SF, CF, OF.","True: cmp computes rcx − 4 and sets ZF, SF, CF, OF."]]},

{id:"n3-16", t:3, s:"new", kind:"tf",
 q:["Påstand: I koden under hopper <code>jnz top</code> fordi <code>pop rcx</code> henter verdien 0, og pop setter ZF etter den nye verdien i rcx.","Claim: In the code below, <code>jnz top</code> jumps because <code>pop rcx</code> loads the value 0, and pop sets ZF from the new value in rcx."],
 c:`  mov rcx, 5
  dec rcx          ; rcx = 4
  push 0
  pop rcx          ; rcx = 0
  jnz top`,
 o:[["Sant","True"],["Usant","False"]],
 a:1,
 w:["Usant. <code>pop</code> (som mov og push) endrer <b>ikke</b> flaggene. Siste flaggsettende instruksjon er <code>dec rcx</code>, som ga 4 ≠ 0 → ZF = 0. Derfor <b>hopper</b> jnz – men på grunn av dec, ikke pop. Selv om rcx nå er 0, ville jnz ha hoppet. Det er nettopp dette H24 og H25 tester.",
    "False. <code>pop</code> (like mov and push) does <b>not</b> change the flags. The last flag-setting instruction is <code>dec rcx</code>, which gave 4 ≠ 0 → ZF = 0. So jnz <b>does</b> jump – but because of dec, not pop. Even though rcx is now 0, jnz still jumps. That is exactly what H24 and H25 test."],
 x:[["pop setter ingen flagg; ZF kommer fra dec (4 ≠ 0 → ZF = 0).","pop sets no flags; ZF comes from dec (4 ≠ 0 → ZF = 0)."], null]},

{id:"n3-17", t:3, s:"new", kind:"multi",
 q:["Hvilke påstander om Linux x86-64 <code>syscall</code> stemmer? Velg alle som stemmer.","Which statements about Linux x86-64 <code>syscall</code> are true? Select all that apply."],
 o:[["Syscall-nummeret legges i rax","The syscall number goes in rax"],
    ["4. argument legges i r10, ikke rcx","The 4th argument goes in r10, not rcx"],
    ["<code>syscall</code> overskriver rcx og r11","<code>syscall</code> overwrites rcx and r11"],
    ["execve har nummer 60","execve has number 60"],
    ["Returverdien kommer tilbake i rdi","The return value comes back in rdi"],
    ["<code>mov rax, 0</code>, <code>mov rdi, 0</code>, buffer i rsi, lengde i rdx, <code>syscall</code> leser fra stdin","<code>mov rax, 0</code>, <code>mov rdi, 0</code>, buffer in rsi, length in rdx, <code>syscall</code> reads from stdin"]],
 a:[0,1,2,5],
 w:["Tabell: rax = <b>0 read(fd, buf, len)</b>, <b>1 write(fd, buf, len)</b>, <b>59 execve(path, argv, envp)</b>, <b>60 exit(status)</b>. Argumenter i rdi, rsi, rdx, r10, r8, r9. Resultat i rax (antall byte for read/write, negativ feilkode ved feil). Instruksjonen lagrer returadressen i rcx og RFLAGS i r11, så de er ødelagt etterpå.",
    "Table: rax = <b>0 read(fd, buf, len)</b>, <b>1 write(fd, buf, len)</b>, <b>59 execve(path, argv, envp)</b>, <b>60 exit(status)</b>. Arguments in rdi, rsi, rdx, r10, r8, r9. Result in rax (byte count for read/write, negative error code on failure). The instruction saves the return address in rcx and RFLAGS in r11, so both are clobbered afterwards."],
 x:[["Sant: rax velger hvilken syscall som kjøres.","True: rax selects which syscall runs."],
    ["Sant: rcx kan ikke brukes fordi syscall selv skriver returadressen dit.","True: rcx cannot be used because syscall itself writes the return address there."],
    ["Sant: rcx ← rip, r11 ← RFLAGS. Lagre rcx med push/pop eller bruk et annet register.","True: rcx ← rip, r11 ← RFLAGS. Save rcx with push/pop or use another register."],
    ["Usant: execve = 59, exit = 60.","False: execve = 59, exit = 60."],
    ["Usant: resultatet kommer i rax; rdi er 1. argument.","False: the result comes in rax; rdi is the 1st argument."],
    ["Sant: read = 0 og fd 0 = stdin.","True: read = 0 and fd 0 = stdin."]]}

);
