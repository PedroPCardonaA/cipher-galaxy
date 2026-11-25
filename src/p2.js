// Planet 2: Overflow Prime (binary exploitation)
const ROP25_C = `void vulnerable() {
    char buf[8];
    printf("Enter your input:\\n");
    gets(buf);
}
// gcc -fno-stack-protector -no-pie vuln.c -o vuln   (ASLR off, NX stack)

0x0000000000401000 : add rax, 1 ; ret
0x000000000040101a : pop rdi ; ret
0x0000000000401020 : xor rax, rax ; ret
0x0000000000401024 : pop rsi ; pop r15 ; ret
0x0000000000401030 : pop rdx ; ret
0x0000000000401040 : pop rax ; ret
0x0000000000401048 : nop ; ret
0x0000000000401050 : syscall
0x0000000000401060 : mov rbx, rdi ; ret

"/bin/sh" is at 0x0000000000602050
execve: rax = 59, rdi = &"/bin/sh", rsi = 0, rdx = 0`;

QB.push(
{id:"H23-2", t:2, s:"e23", kind:"single",
 q:["Et effektivt grep mot shellcode er:","An effective measure against shellcode is:"],
 o:[["shadow stack","shadow stack"],["NX stack","NX stack"],["heap allocation","heap allocation"],["setuid-root binaries","setuid-root binaries"]],
 a:1,
 w:["<b>NX</b> (non-executable stack, DEP) merker stakken som ikke-kjørbar. Shellcode som er injisert i en buffer på stakken kan da ikke kjøres: CPU-en gir en feil når RIP peker dit. Omgåelse: ROP/ret2libc, som gjenbruker kode som allerede er kjørbar.",
    "<b>NX</b> (non-executable stack, DEP) marks the stack as non-executable. Shellcode injected into a stack buffer then cannot run: the CPU faults when RIP points there. Bypass: ROP/ret2libc, which reuses code that is already executable."],
 x:[["En shadow stack beskytter returadresser (kontrollflyt). Den hindrer ikke at injisert kode kjøres, og er ikke det klassiske svaret mot shellcode.","A shadow stack protects return addresses (control flow). It does not stop injected code from executing and is not the classic answer against shellcode."],
    null,
    ["Å legge data på heapen hindrer ikke kjøring. En kjørbar heap kan like godt inneholde shellcode.","Putting data on the heap does not stop execution. An executable heap can hold shellcode just as well."],
    ["setuid-root gjør det verre: kode som kjører der får root-rettigheter.","setuid-root makes it worse: code running there gets root privileges."]]},

{id:"H23-4", t:2, s:"e23", kind:"single",
 q:["Hvilken av de følgende elementer kan <b>ikke</b> overskreves når det skjer en stack buffer overflow?","Which of the following elements can <b>not</b> be overwritten in a stack buffer overflow?"],
 o:[["return address","return address"],["lagret RBP","saved RBP"],["RAX/EAX","RAX/EAX"],["andre stack variabler","other stack variables"]],
 a:2,
 w:["En stack overflow skriver forbi bufferen i <b>minnet</b> mot høyere adresser: andre lokale variabler, lagret RBP og returadressen. <b>RAX/EAX er et register</b> i CPU-en, ikke en minnecelle, så overflowen kan ikke skrive direkte til det.",
    "A stack overflow writes past the buffer in <b>memory</b> towards higher addresses: other locals, the saved RBP and the return address. <b>RAX/EAX is a CPU register</b>, not a memory cell, so the overflow cannot write to it directly."],
 x:[["Returadressen ligger over bufferen på stakken og er nettopp målet for en klassisk overflow.","The return address lies above the buffer on the stack and is exactly the target of a classic overflow."],
    ["Lagret RBP ligger mellom de lokale variablene og returadressen, så den overskrives før returadressen.","The saved RBP sits between the locals and the return address, so it is overwritten before the return address."],
    null,
    ["Lokale variabler som ligger over bufferen i rammen kan overskrives (f.eks. et flagg <code>is_admin</code>).","Locals placed above the buffer in the frame can be overwritten (e.g. an <code>is_admin</code> flag)."]]},

{id:"H23-5-bin1", t:2, s:"e23", kind:"single",
 q:["(Matching fra 2023 «Exploits».) Hvilken input er best for å finne en <b>string format vulnerability</b>?","(Matching from 2023 \"Exploits\".) Which input is best for finding a <b>string format vulnerability</b>?"],
 o:[["<code>%p</code>","<code>%p</code>"],["<code>{{ 2+2 }}</code>","<code>{{ 2+2 }}</code>"],["<code>|| id</code>","<code>|| id</code>"],["<code>\"&gt;</code>","<code>\"&gt;</code>"]],
 a:0,
 w:["<code>%p</code> er en format-spesifikator. Hvis brukerinput sendes direkte som format-streng (<code>printf(buf)</code>), skriver <code>printf</code> ut pekerverdier fra registre/stakk (f.eks. <code>0x7ffd…</code>) i stedet for teksten «%p». Det avslører feilen og lekker adresser.",
    "<code>%p</code> is a format specifier. If user input is passed directly as the format string (<code>printf(buf)</code>), <code>printf</code> prints pointer values from registers/stack (e.g. <code>0x7ffd…</code>) instead of the text \"%p\". That reveals the bug and leaks addresses."],
 x:[null,
    ["<code>{{ 2+2 }}</code> tester server-side template injection (svar 4 betyr at malen evalueres).","<code>{{ 2+2 }}</code> tests server-side template injection (a reply of 4 means the template is evaluated)."],
    ["<code>|| id</code> tester command injection i et shell.","<code>|| id</code> tests command injection into a shell."],
    ["<code>\"&gt;</code> bryter ut av et HTML-attributt og tester XSS.","<code>\"&gt;</code> breaks out of an HTML attribute and tests XSS."]]},

{id:"H23-5-bin2", t:2, s:"e23", kind:"multi",
 q:["(2023 «Exploits», hele matchingen.) Hvilke par input → angrepsvektor er riktige?","(2023 \"Exploits\", full matching.) Which input → attack vector pairs are correct?"],
 o:[["<code>' or sleep(10); --</code> → SQL injection","<code>' or sleep(10); --</code> → SQL injection"],
    ["<code>http://0.0.0.0:8081</code> → Server-side request forgery","<code>http://0.0.0.0:8081</code> → Server-side request forgery"],
    ["<code>%p</code> → Cross-site script injection","<code>%p</code> → Cross-site script injection"],
    ["<code>{{ 2+2 }}</code> → Server-side template injection","<code>{{ 2+2 }}</code> → Server-side template injection"],
    ["<code>|| id</code> → String format vulnerability","<code>|| id</code> → String format vulnerability"]],
 a:[0,1,3],
 w:["Riktig matching: <code>' or sleep(10); --</code> → SQLi (tidsbasert blind), <code>|| id</code> → command injection, <code>{{ 2+2 }}</code> → SSTI, <code>\"&gt;</code> → XSS, <code>http://0.0.0.0:8081</code> → SSRF (lokal tjeneste), <code>%p</code> → format string.",
    "Correct matching: <code>' or sleep(10); --</code> → SQLi (time-based blind), <code>|| id</code> → command injection, <code>{{ 2+2 }}</code> → SSTI, <code>\"&gt;</code> → XSS, <code>http://0.0.0.0:8081</code> → SSRF (local service), <code>%p</code> → format string."],
 x:[["Riktig: avslutter strengen, og <code>sleep(10)</code> gir en målbar forsinkelse hvis SQL-en kjøres.","Correct: it closes the string, and <code>sleep(10)</code> gives a measurable delay if the SQL runs."],
    ["Riktig: serveren lures til å hente en intern adresse den selv kan nå.","Correct: the server is tricked into fetching an internal address it can reach."],
    ["Feil: <code>%p</code> hører til format string. XSS er <code>\"&gt;</code>.","Wrong: <code>%p</code> belongs to format string. XSS is <code>\"&gt;</code>."],
    ["Riktig: svaret «4» viser at malmotoren evaluerer input.","Correct: the reply \"4\" shows the template engine evaluates input."],
    ["Feil: <code>|| id</code> er command injection. Format string er <code>%p</code>.","Wrong: <code>|| id</code> is command injection. Format string is <code>%p</code>."]]},

{id:"H24-11a", t:2, s:"e24", kind:"single",
 q:["Hva er det <b>felles målet</b> mellom en stack canary og en ikke-utførbar (NX) stack?","What is the <b>common goal</b> of a stack canary and a non-executable (NX) stack?"],
 o:[["Å hindre at en stack buffer overflow kan brukes til å kapre kontrollflyten og kjøre angriperens kode","To stop a stack buffer overflow from being used to hijack control flow and run the attacker's code"],
    ["Å randomisere adressene til stakk, heap og libc ved hver kjøring","To randomise the stack, heap and libc addresses on every run"],
    ["Å hindre at angriperen leser hemmelige data fra stakken","To stop the attacker from reading secret data from the stack"],
    ["Å fjerne selve overflow-feilen ved å sjekke grensene i <code>gets</code>","To remove the overflow bug itself by bounds-checking <code>gets</code>"]],
 a:0,
 w:["Begge er <b>mitigeringer mot utnyttelse av stack overflows</b>: de fjerner ikke feilen, men gjør det vanskelig å gjøre den om til kodekjøring.<br>• Canary: oppdager at returadressen er overskrevet <i>før</i> <code>ret</code>, og avbryter.<br>• NX: selv om flyten kapres, kan injisert kode på stakken ikke kjøres.",
    "Both are <b>mitigations against exploiting stack overflows</b>: they do not remove the bug, they make it hard to turn into code execution.<br>• Canary: detects that the return address was overwritten <i>before</i> <code>ret</code>, and aborts.<br>• NX: even if flow is hijacked, injected code on the stack cannot run."],
 x:[null,
    ["Det er ASLR, ikke canary/NX.","That is ASLR, not canary/NX."],
    ["Ingen av dem hindrer lesing. En format-string-lekkasje kan til og med lese canaryen.","Neither stops reading. A format-string leak can even read the canary."],
    ["Mitigeringer endrer ikke <code>gets</code>. Overflowen skjer fortsatt; bare utnyttelsen hindres.","Mitigations do not change <code>gets</code>. The overflow still happens; only exploitation is hindered."]]},

{id:"H24-11b", t:2, s:"e24", kind:"multi",
 q:["Hva er <b>forskjellene</b> mellom stack canary og NX? Velg alle riktige.","What are the <b>differences</b> between a stack canary and NX? Select all that are true."],
 o:[["Canary er en kompilator-mitigering (sjekk satt inn i funksjonens epilog); NX er en maskinvare/OS-egenskap ved minnesidene","The canary is a compiler mitigation (a check in the function epilogue); NX is a hardware/OS property of memory pages"],
    ["Canary oppdager en lineær overskriving av returadressen; NX hindrer kjøring av kode i datasegmenter","The canary detects a linear overwrite of the return address; NX prevents executing code in data segments"],
    ["NX stopper ROP, fordi gadgetene ligger på stakken","NX stops ROP, because the gadgets live on the stack"],
    ["En canary kan omgås ved å lekke verdien (f.eks. med format string) og skrive den tilbake uendret","A canary can be bypassed by leaking its value (e.g. via format string) and writing it back unchanged"],
    ["Canary hindrer også at angriperen overskriver lokale variabler som ligger over bufferen","The canary also prevents the attacker from overwriting locals that lie above the buffer"]],
 a:[0,1,3],
 w:["Canary: tilfeldig verdi mellom lokale variabler og lagret RBP/returadresse, sjekkes før <code>ret</code> (<code>__stack_chk_fail</code>). Omgås ved lekkasje eller brute force i forkende servere.<br>NX: sidene for stakk/heap er skrivbare men ikke kjørbare. Omgås med ROP/ret2libc, der gadgetene ligger i kjørbar <code>.text</code>/libc.",
    "Canary: a random value between the locals and the saved RBP/return address, checked before <code>ret</code> (<code>__stack_chk_fail</code>). Bypassed by leaking it or brute force in forking servers.<br>NX: stack/heap pages are writable but not executable. Bypassed with ROP/ret2libc, whose gadgets live in executable <code>.text</code>/libc."],
 x:[["Sant: <code>-fstack-protector</code> setter inn sjekken; NX er en bit i sidetabellen.","True: <code>-fstack-protector</code> inserts the check; NX is a bit in the page table."],
    ["Sant: de stopper hvert sitt steg i angrepet (overskriving vs. kjøring).","True: they block different steps of the attack (overwrite vs. execution)."],
    ["Usant: stakken inneholder bare <i>adressene</i> til gadgetene; selve koden ligger i kjørbare seksjoner, så NX stopper ikke ROP.","False: the stack only holds gadget <i>addresses</i>; the code itself is in executable sections, so NX does not stop ROP."],
    ["Sant: hvis canaryen er kjent, skrives den tilbake på riktig plass og sjekken passerer.","True: once known, the canary is written back in place and the check passes."],
    ["Usant: canaryen sjekkes først ved retur, og variabler mellom bufferen og canaryen kan overskrives uten at det oppdages.","False: the canary is only checked on return, and variables between the buffer and the canary can be overwritten undetected."]]},


{id:"H24-11c", t:2, s:"e24", kind:"tf",
 q:["Sant eller usant: Med NX aktivert, men uten canary, kan en stack overflow fortsatt gi kodekjøring ved hjelp av ROP.","True or false: With NX enabled but no canary, a stack overflow can still lead to code execution using ROP."],
 o:[["Sant","True"],["Usant","False"]],
 a:0,
 w:["Sant. NX hindrer bare kjøring av <i>ny</i> kode på stakken. Uten canary kan returadressen overskrives, og ROP kjeder sammen eksisterende kjørbare instruksjonssekvenser som slutter på <code>ret</code>. Det er scenariet i 2025-oppgave 1.2.",
    "True. NX only stops executing <i>new</i> code on the stack. Without a canary the return address can be overwritten, and ROP chains existing executable instruction sequences ending in <code>ret</code>. That is the 2025 task 1.2 scenario."],
 x:[null,["NX stopper ikke gjenbruk av kode som allerede er kjørbar; stakken inneholder bare adresser og data.","NX does not stop reuse of code that is already executable; the stack only holds addresses and data."]]},

{id:"H25-1.2a", t:2, s:"e25", kind:"num",
 q:["(2025 1.2 ROP) <code>vulnerable()</code> har <code>char buf[8]</code> og er kompilert uten canary. Hvor mange byte med fyll (padding) må sendes før den første gadget-adressen havner på returadressen?","(2025 1.2 ROP) <code>vulnerable()</code> has <code>char buf[8]</code> and is compiled without a canary. How many padding bytes must be sent before the first gadget address lands on the return address?"],
 c:ROP25_C,
 f:["$\\text{padding} = \\text{buf} + 8\\ (\\text{lagret RBP})$","$\\text{padding} = \\text{buf} + 8\\ (\\text{saved RBP})$"],
 ans:16, tol:0.5, unit:["byte","bytes"],
 w:["Padding = 8 (buf) + 8 (lagret RBP) = <b>16 byte</b>. Fasiten: <code>\"A\"*8</code> fyller bufferen, <code>\"B\"*8</code> overskriver lagret RBP, og neste 8 byte er returadressen = første gadget. (Ingen canary pga. <code>-fno-stack-protector</code>.)",
    "Padding = 8 (buf) + 8 (saved RBP) = <b>16 bytes</b>. Model answer: <code>\"A\"*8</code> fills the buffer, <code>\"B\"*8</code> overwrites the saved RBP, and the next 8 bytes are the return address = first gadget. (No canary because of <code>-fno-stack-protector</code>.)"]},

{id:"H25-1.2b", t:2, s:"e25", kind:"single",
 q:["(2025 1.2) Hvorfor må paddingen være 8 byte <b>lengre</b> enn bufferen?","(2025 1.2) Why must the padding be 8 bytes <b>longer</b> than the buffer?"],
 c:ROP25_C,
 o:[["For å overskrive stack canaryen","To overwrite the stack canary"],["For å overskrive lagret RBP som ligger mellom bufferen og returadressen","To overwrite the saved RBP that sits between the buffer and the return address"],["Fordi <code>gets</code> legger til en 8-byte nullterminator","Because <code>gets</code> appends an 8-byte null terminator"],["For å justere stakken til 16 byte før <code>syscall</code>","To align the stack to 16 bytes before <code>syscall</code>"]],
 a:1,
 w:["Funksjonsprologen <code>push rbp; mov rbp, rsp</code> legger den gamle RBP rett over de lokale variablene. Rekkefølge fra lav til høy adresse: <code>buf[8]</code> → lagret RBP (8) → returadresse. Derfor buf + 8.",
    "The prologue <code>push rbp; mov rbp, rsp</code> puts the old RBP just above the locals. Order from low to high address: <code>buf[8]</code> → saved RBP (8) → return address. Hence buf + 8."],
 x:[["Programmet er kompilert med <code>-fno-stack-protector</code>, så det finnes ingen canary.","The program is compiled with <code>-fno-stack-protector</code>, so there is no canary."],
    null,
    ["<code>gets</code> skriver én nullbyte, ikke 8, og den forklarer ikke layouten.","<code>gets</code> writes one null byte, not 8, and that does not explain the layout."],
    ["Justering kan noen ganger kreve en ekstra <code>ret</code>-gadget, men det er ikke grunnen til +8 i paddingen.","Alignment can sometimes need an extra <code>ret</code> gadget, but that is not why the padding is +8."]]},

{id:"H25-1.2c", t:2, s:"e25", kind:"multi",
 q:["(2025 1.2) Hvilke gadgets trengs i kjeden for <code>execve(\"/bin/sh\", 0, 0)</code>? Velg alle.","(2025 1.2) Which gadgets are needed in the chain for <code>execve(\"/bin/sh\", 0, 0)</code>? Select all."],
 c:ROP25_C,
 o:[["<code>pop rdi ; ret</code> (0x40101a)","<code>pop rdi ; ret</code> (0x40101a)"],["<code>pop rsi ; pop r15 ; ret</code> (0x401024)","<code>pop rsi ; pop r15 ; ret</code> (0x401024)"],["<code>mov rbx, rdi ; ret</code> (0x401060)","<code>mov rbx, rdi ; ret</code> (0x401060)"],["<code>pop rdx ; ret</code> (0x401030)","<code>pop rdx ; ret</code> (0x401030)"],["<code>pop rax ; ret</code> (0x401040)","<code>pop rax ; ret</code> (0x401040)"],["<code>syscall</code> (0x401050)","<code>syscall</code> (0x401050)"]],
 a:[0,1,3,4,5],
 w:["Ett gadget per register som må settes, pluss <code>syscall</code>: rdi = adressen til \"/bin/sh\", rsi = 0, rdx = 0, rax = 59. <code>add rax,1</code>, <code>xor rax,rax</code>, <code>nop</code> og <code>mov rbx,rdi</code> er distraktorer (rbx brukes ikke av execve).",
    "One gadget per register to set, plus <code>syscall</code>: rdi = address of \"/bin/sh\", rsi = 0, rdx = 0, rax = 59. <code>add rax,1</code>, <code>xor rax,rax</code>, <code>nop</code> and <code>mov rbx,rdi</code> are distractors (execve does not use rbx)."],
 x:[["Trengs: setter rdi = 0x602050 (\"/bin/sh\").","Needed: sets rdi = 0x602050 (\"/bin/sh\")."],
    ["Trengs: eneste måte å sette rsi = 0 på; r15 får en dummyverdi.","Needed: the only way to set rsi = 0; r15 gets a dummy value."],
    ["Trengs ikke: rbx er ikke et syscall-argument.","Not needed: rbx is not a syscall argument."],
    ["Trengs: setter rdx = 0 (envp = NULL).","Needed: sets rdx = 0 (envp = NULL)."],
    ["Trengs: setter rax = 59 = 0x3b direkte.","Needed: sets rax = 59 = 0x3b directly."],
    ["Trengs: utfører selve systemkallet, sist i kjeden.","Needed: performs the system call itself, last in the chain."]]},

{id:"H25-1.2d", t:2, s:"e25", kind:"single",
 q:["(2025 1.2) Hva må stå på stakken rett etter adressen til <code>pop rsi ; pop r15 ; ret</code>?","(2025 1.2) What must be on the stack right after the address of <code>pop rsi ; pop r15 ; ret</code>?"],
 c:ROP25_C,
 o:[["Bare <code>0x0000000000000000</code> (rsi), deretter neste gadget","Only <code>0x0000000000000000</code> (rsi), then the next gadget"],["<code>0x0000000000000000</code> (rsi) og så en vilkårlig dummyverdi (r15), deretter neste gadget","<code>0x0000000000000000</code> (rsi), then any dummy value (r15), then the next gadget"],["En dummyverdi (r15) og så <code>0x0000000000000000</code> (rsi)","A dummy value (r15), then <code>0x0000000000000000</code> (rsi)"],["Adressen til \"/bin/sh\", siden rsi er første argument","The address of \"/bin/sh\", since rsi is the first argument"]],
 a:1,
 w:["Gadgeten kjører <code>pop rsi</code> først og så <code>pop r15</code>, så den bruker <b>to</b> stakkverdier i den rekkefølgen: 0 → rsi, så en dummy → r15 (fasiten bruker 0 igjen). Glemmer du dummyen, blir neste gadget-adresse poppet inn i r15 og kjeden går i stykker.",
    "The gadget runs <code>pop rsi</code> first, then <code>pop r15</code>, so it consumes <b>two</b> stack values in that order: 0 → rsi, then a dummy → r15 (the model answer uses 0 again). Forget the dummy and the next gadget address is popped into r15, breaking the chain."],
 x:[["Mangler dummyverdien til r15: neste gadget-adresse havner i r15 i stedet for å bli returnert til.","Missing the r15 dummy: the next gadget address ends up in r15 instead of being returned to."],
    null,
    ["Feil rekkefølge: den første verdien etter adressen poppes til rsi.","Wrong order: the first value after the address is popped into rsi."],
    ["Første argument er rdi, ikke rsi. rsi (argv) skal være NULL.","The first argument is rdi, not rsi. rsi (argv) must be NULL."]]},

{id:"H25-1.2e", t:2, s:"e25", kind:"single",
 q:["(2025 1.2) Hvilken verdi skal stå rett etter adressen til <code>pop rax ; ret</code>?","(2025 1.2) Which value goes right after the address of <code>pop rax ; ret</code>?"],
 c:ROP25_C,
 o:[["<code>0x0000000000000059</code>","<code>0x0000000000000059</code>"],["<code>0x000000000000003b</code>","<code>0x000000000000003b</code>"],["<code>0x0000000000000001</code>","<code>0x0000000000000001</code>"],["<code>0x0000000000602050</code>","<code>0x0000000000602050</code>"]],
 a:1,
 w:["execve er syscall nummer <b>59 desimalt</b>. Formatet krever heksadesimal: 59 = 3·16 + 11 = <b>0x3b</b>, skrevet som 64-bit <code>0x000000000000003b</code>.",
    "execve is syscall number <b>59 decimal</b>. The format requires hex: 59 = 3·16 + 11 = <b>0x3b</b>, written as 64-bit <code>0x000000000000003b</code>."],
 f:["$59_{10} = 3\\cdot 16 + 11 = \\mathtt{0x3b}$","$59_{10} = 3\\cdot 16 + 11 = \\mathtt{0x3b}$"],
 x:[["0x59 = 89 desimalt. Typisk feil: å skrive desimaltallet 59 med 0x foran.","0x59 = 89 decimal. Typical mistake: writing the decimal 59 with a 0x prefix."],
    null,
    ["1 er write, ikke execve.","1 is write, not execve."],
    ["Det er adressen til \"/bin/sh\", som hører til rdi.","That is the address of \"/bin/sh\", which belongs in rdi."]]},

{id:"H25-1.2f", t:2, s:"e25", kind:"single",
 q:["(2025 1.2) Hvilken kjede får full uttelling? (Gadgetlisten er som i oppgaven; <code>A*8</code> = 8 byte med 0x41.)","(2025 1.2) Which chain earns full marks? (Gadget list as in the task; <code>A*8</code> = 8 bytes of 0x41.)"],
 c:`Chain A                Chain B                Chain C                Chain D
[ "A"*8 ]              [ "A"*8 ]              [ "A"*8 ]              [ "A"*8 ]
[ "B"*8 ]              [ 0x40101a ] pop rdi   [ "B"*8 ]              [ "B"*8 ]
[ 0x40101a ] pop rdi   [ 0x602050 ]           [ 0x40101a ] pop rdi   [ 0x40101a ] pop rdi
[ 0x602050 ]           [ 0x401024 ] pop rsi.. [ 0x602050 ]           [ 0x602050 ]
[ 0x401024 ] pop rsi.. [ 0x0 ]                [ 0x401024 ] pop rsi.. [ 0x401024 ] pop rsi..
[ 0x0 ]                [ 0x0 ]                [ 0x0 ]                [ 0x0 ]
[ 0x0 ]                [ 0x401030 ] pop rdx   [ 0x401030 ] pop rdx   [ 0x0 ]
[ 0x401040 ] pop rax   [ 0x0 ]                [ 0x0 ]                [ 0x401030 ] pop rdx
[ 0x3b ]               [ 0x401040 ] pop rax   [ 0x401040 ] pop rax   [ 0x0 ]
[ 0x401030 ] pop rdx   [ 0x3b ]               [ 0x3b ]               [ 0x401050 ] syscall
[ 0x0 ]                [ 0x401050 ] syscall   [ 0x401050 ] syscall   [ 0x401040 ] pop rax
[ 0x401050 ] syscall                                                 [ 0x3b ]
(all addresses written as full 64-bit values in the real answer)`,
 o:[["Kjede A","Chain A"],["Kjede B","Chain B"],["Kjede C","Chain C"],["Kjede D","Chain D"]],
 a:0,
 w:["Kjede A: 16 byte padding (buf + lagret RBP), hver pop-gadget etterfulgt av sin verdi, dummy for r15, og <code>syscall</code> sist. Rekkefølgen på pop-ene er fri (fasiten setter rdx før rax, A setter rax før rdx; begge er godkjent) så lenge alle skjer før syscall.",
    "Chain A: 16 bytes of padding (buf + saved RBP), each pop gadget followed by its value, a dummy for r15, and <code>syscall</code> last. The order of the pops is free (the model answer sets rdx before rax, A sets rax before rdx; both are accepted) as long as all happen before syscall."],
 x:[null,
    ["Bare 8 byte padding: lagret RBP blir overskrevet med gadget-adressen, og returadressen blir 0x602050 i stedet for pop rdi.","Only 8 bytes of padding: the saved RBP is overwritten by the gadget address, and the return address becomes 0x602050 instead of pop rdi."],
    ["Mangler dummyverdien for r15: <code>pop r15</code> sluker 0x401030, så kjeden returnerer til 0x0 og krasjer.","Missing the r15 dummy: <code>pop r15</code> swallows 0x401030, so the chain returns to 0x0 and crashes."],
    ["<code>syscall</code> kjøres før rax er satt; rax er da ikke 59, så execve kalles ikke.","<code>syscall</code> runs before rax is set; rax is not 59 then, so execve is not called."]]},

{id:"H25-1.2g", t:2, s:"e25", kind:"num",
 q:["(2025 1.2) Hvor mange byte er hele den riktige payloaden (padding + alle 8-byte stakkverdier i fasiten)?","(2025 1.2) How many bytes is the whole correct payload (padding + all 8-byte stack values in the model answer)?"],
 c:ROP25_C,
 f:["$\\text{lengde} = (\\text{buf}+8) + 8\\cdot(\\#\\text{gadgets} + \\#\\text{verdier})$","$\\text{length} = (\\text{buf}+8) + 8\\cdot(\\#\\text{gadgets} + \\#\\text{values})$"],
 ans:96, tol:0.5, unit:["byte","bytes"],
 w:["Padding 8 + 8 = 16.<br>Gadgets: pop rdi, pop rsi;pop r15, pop rdx, pop rax, syscall = 5.<br>Verdier: \"/bin/sh\"-adresse, 0 (rsi), dummy (r15), 0 (rdx), 0x3b (rax) = 5.<br>16 + 8·(5 + 5) = 16 + 80 = <b>96 byte</b>.",
    "Padding 8 + 8 = 16.<br>Gadgets: pop rdi, pop rsi;pop r15, pop rdx, pop rax, syscall = 5.<br>Values: \"/bin/sh\" address, 0 (rsi), dummy (r15), 0 (rdx), 0x3b (rax) = 5.<br>16 + 8·(5 + 5) = 16 + 80 = <b>96 bytes</b>."]},

{id:"H25-1.2h", t:2, s:"e25", kind:"single",
 q:["(2025 1.2) En student setter <code>pop rax ; ret</code> + <code>0x3b</code>, og legger deretter inn <code>xor rax, rax ; ret</code> «for å nullstille» før <code>pop rdx</code>, <code>0x0</code>, <code>syscall</code>. Hva skjer?","(2025 1.2) A student sets <code>pop rax ; ret</code> + <code>0x3b</code>, then inserts <code>xor rax, rax ; ret</code> \"to clear things\" before <code>pop rdx</code>, <code>0x0</code>, <code>syscall</code>. What happens?"],
 c:ROP25_C,
 o:[["Ingenting galt: xor påvirker bare flaggene","Nothing goes wrong: xor only affects the flags"],["rdx blir 0, som ønsket","rdx becomes 0, as intended"],["rax blir 0, så syscall kjører <code>read</code> i stedet for <code>execve</code>","rax becomes 0, so syscall runs <code>read</code> instead of <code>execve</code>"],["Programmet krasjer på xor fordi stakken er NX","The program crashes on xor because the stack is NX"]],
 a:2,
 w:["<b>Sideeffekt</b>: <code>xor rax, rax</code> setter rax = 0 og overskriver 59. syscall 0 er <code>read</code>, så ingen shell. Regel: sett rax <i>etter</i> gadgets som rører rax, og sjekk hva hver gadget gjør med andre registre.",
    "<b>Side effect</b>: <code>xor rax, rax</code> sets rax = 0, overwriting 59. Syscall 0 is <code>read</code>, so no shell. Rule: set rax <i>after</i> any gadget that touches rax, and check what each gadget does to other registers."],
 x:[["<code>xor rax, rax</code> skriver 0 til rax (og setter ZF).","<code>xor rax, rax</code> writes 0 to rax (and sets ZF)."],
    ["xor-en rører ikke rdx; rdx settes av <code>pop rdx</code> uansett.","The xor does not touch rdx; rdx is set by <code>pop rdx</code> anyway."],
    null,
    ["Gadgeten ligger i kjørbar <code>.text</code>; NX gjelder bare stakken.","The gadget lives in executable <code>.text</code>; NX only covers the stack."]]},

{id:"H25-1.2i", t:2, s:"e25", kind:"tf",
 q:["Sant eller usant: Kjeden fra 2025 1.2, med hardkodede adresser som 0x40101a og 0x602050, ville virket uendret også med PIE og ASLR slått på.","True or false: The 2025 1.2 chain, with hardcoded addresses such as 0x40101a and 0x602050, would work unchanged with PIE and ASLR turned on."],
 o:[["Sant","True"],["Usant","False"]],
 a:1,
 w:["Usant. Oppgaven sier <code>-no-pie</code> og ASLR av, nettopp fordi adressene da er faste. Med PIE lastes binæren på en tilfeldig base, så gadget- og strengadressene flytter seg. Angriperen må først <b>lekke</b> en adresse (f.eks. med format string) og regne ut basen.",
    "False. The task says <code>-no-pie</code> and ASLR off precisely because addresses are then fixed. With PIE the binary loads at a random base, so gadget and string addresses move. The attacker must first <b>leak</b> an address (e.g. via format string) and compute the base."],
 x:[["Med PIE + ASLR er basen tilfeldig for hver kjøring, så hardkodede adresser peker feil.","With PIE + ASLR the base is random on each run, so hardcoded addresses point to the wrong place."],null]},

{id:"n2-01", t:2, s:"new", kind:"num",
 q:["En funksjon har <code>char name[64]</code> og leser med <code>gets(name)</code>. Binæren er uten canary. Hvor mange byte padding trengs før returadressen?","A function has <code>char name[64]</code> and reads with <code>gets(name)</code>. The binary has no canary. How many padding bytes are needed before the return address?"],
 c:`high addresses
  [ return address ]   <- target
  [ saved RBP      ]   8 bytes
  [ name[64]       ]   64 bytes
low addresses`,
 f:["$\\text{padding} = \\text{buf} + 8$","$\\text{padding} = \\text{buf} + 8$"],
 ans:72, tol:0.5, unit:["byte","bytes"],
 w:["64 (buffer) + 8 (lagret RBP) = <b>72 byte</b>. Byte 73–80 blir den nye returadressen. Vanlig feil: 64 (glemmer RBP) eller 80 (teller med returadressen). I praksis kan kompilatoren legge inn ekstra justering, så verifiser med en debugger/cyclic pattern.",
    "64 (buffer) + 8 (saved RBP) = <b>72 bytes</b>. Bytes 73–80 become the new return address. Common mistakes: 64 (forgetting RBP) or 80 (counting the return address too). In practice the compiler may add alignment, so confirm with a debugger/cyclic pattern."]},

{id:"n2-02", t:2, s:"new", kind:"tf",
 q:["Sant eller usant: Med <b>full RELRO</b> er GOT skrivebeskyttet etter oppstart, så et angrep som overskriver en GOT-oppføring (f.eks. med <code>%n</code>) feiler.","True or false: With <b>full RELRO</b> the GOT is read-only after startup, so an attack that overwrites a GOT entry (e.g. with <code>%n</code>) fails."],
 o:[["Sant","True"],["Usant","False"]],
 a:0,
 w:["Sant. Full RELRO (<code>-Wl,-z,relro,-z,now</code>) løser alle symboler ved oppstart og gjør GOT read-only. Omgåelse: velg et annet mål, f.eks. returadressen, en funksjonspeker eller hooks i libc. Partial RELRO lar GOT fortsatt være skrivbar.",
    "True. Full RELRO (<code>-Wl,-z,relro,-z,now</code>) resolves all symbols at startup and makes the GOT read-only. Bypass: pick another target, e.g. the return address, a function pointer or libc hooks. Partial RELRO leaves the GOT writable."],
 x:[null,["Det gjelder partial RELRO; med full RELRO er GOT read-only.","That describes partial RELRO; with full RELRO the GOT is read-only."]]},

{id:"n2-03", t:2, s:"new", kind:"single",
 q:["En nettverkstjeneste <code>fork()</code>-er en ny prosess per tilkobling og har stack canary. Hvorfor kan canaryen likevel brute-forces?","A network service <code>fork()</code>s a new process per connection and has a stack canary. Why can the canary still be brute-forced?"],
 o:[["Barneprosessene arver samme canary, så den kan gjettes én byte om gangen (≈ 256 forsøk per byte)","The children inherit the same canary, so it can be guessed one byte at a time (≈ 256 tries per byte)"],["Canaryen er alltid 0 i forkede prosesser","The canary is always 0 in forked processes"],["fork slår av NX, så shellcode kan kjøres direkte","fork disables NX, so shellcode can run directly"],["Canaryen sjekkes bare i <code>main</code>","The canary is only checked in <code>main</code>"]],
 a:0,
 w:["<code>fork()</code> kopierer minnet, inkludert canaryen. Overskriv én byte: hvis barnet ikke krasjer (ingen «stack smashing detected»), er byten riktig. 8 byte × maks 256 forsøk ≈ 2048 forsøk i stedet for 2<sup>64</sup>. Den første byten er dessuten vanligvis 0x00. Forsvar: re-randomiser etter fork (exec).",
    "<code>fork()</code> copies memory, including the canary. Overwrite one byte: if the child does not crash (no \"stack smashing detected\"), the byte is right. 8 bytes × at most 256 tries ≈ 2048 tries instead of 2<sup>64</sup>. The first byte is also usually 0x00. Defence: re-randomise after fork (exec)."],
 x:[null,
    ["Canaryen er tilfeldig (laveste byte er 0x00), ikke 0.","The canary is random (its lowest byte is 0x00), not 0."],
    ["fork endrer ikke sidebeskyttelsen; NX er fortsatt på.","fork does not change page protection; NX stays on."],
    ["Canaryen sjekkes i epilogen til hver beskyttet funksjon.","The canary is checked in the epilogue of every protected function."]]},

{id:"n2-04", t:2, s:"new", kind:"multi",
 q:["Hvilke par <b>beskyttelse → typisk omgåelse</b> er riktige? Velg alle.","Which <b>protection → typical bypass</b> pairs are correct? Select all."],
 o:[["NX/DEP → ROP eller ret2libc (gjenbruk av eksisterende kode)","NX/DEP → ROP or ret2libc (reuse existing code)"],["ASLR → lekk en peker og regn ut basen; partial overwrite; brute force på 32-bit","ASLR → leak a pointer and compute the base; partial overwrite; brute force on 32-bit"],["Stack canary → legg shellcoden på heapen i stedet","Stack canary → put the shellcode on the heap instead"],["PIE → lekk en adresse i binæren for å finne basen","PIE → leak an address in the binary to find its base"],["FORTIFY_SOURCE → bruk <code>%n</code> i en skrivbar format-streng","FORTIFY_SOURCE → use <code>%n</code> in a writable format string"]],
 a:[0,1,3],
 w:["Kompendiets tabell:<br>• Canary: stopper lineær overskriving av returadressen. Omgås ved lekkasje eller brute force (fork).<br>• NX: stopper injisert kode. Omgås med ROP.<br>• ASLR: stopper hardkodede adresser. Omgås ved lekkasje, brute force på 32-bit, partial overwrite.<br>• PIE: lekk binærbasen.<br>• Full RELRO: stopper GOT-overskriving. Velg et annet mål.<br>• FORTIFY: sjekker memcpy/strcpy og blokkerer <code>%n</code> i skrivbare formater. Omgås bare via feil den ikke ser.",
    "The kompendium table:<br>• Canary: stops a linear overwrite of the return address. Bypass: leak it or brute force (fork).<br>• NX: stops injected code. Bypass: ROP.<br>• ASLR: stops hardcoded addresses. Bypass: leak, 32-bit brute force, partial overwrite.<br>• PIE: leak the binary base.<br>• Full RELRO: stops GOT overwrites. Pick another target.<br>• FORTIFY: checks memcpy/strcpy and blocks <code>%n</code> in writable formats. Bypass only via bugs it cannot see."],
 x:[["Riktig: koden som kjøres ligger allerede i kjørbare seksjoner.","Correct: the code that runs is already in executable sections."],
    ["Riktig: én lekket adresse avslører hele den forskjøvne regionen.","Correct: one leaked address reveals the whole shifted region."],
    ["Feil: canaryen sjekkes fortsatt ved retur; å flytte shellcoden hjelper ikke mot det. Omgåelse er å lekke canaryen.","Wrong: the canary is still checked on return; moving the shellcode does not help. The bypass is leaking the canary."],
    ["Riktig: alle adresser i binæren er base + fast offset.","Correct: every address in the binary is base + a fixed offset."],
    ["Feil: FORTIFY_SOURCE blokkerer nettopp <code>%n</code> i skrivbare format-strenger.","Wrong: FORTIFY_SOURCE specifically blocks <code>%n</code> in writable format strings."]]},


{id:"n2-05", t:2, s:"new", kind:"num",
 q:["x86-64 Linux: <code>printf(buf)</code> der <code>buf</code> er brukerstyrt. Hvilken posisjon <i>k</i> i <code>%k$p</code> er den <b>første</b> som leser fra stakken i stedet for et register?","x86-64 Linux: <code>printf(buf)</code> where <code>buf</code> is user-controlled. Which position <i>k</i> in <code>%k$p</code> is the <b>first</b> to read from the stack instead of a register?"],
 f:["$k=1..5:\\ \\text{rsi, rdx, rcx, r8, r9};\\quad k\\ge 6:\\ \\text{stakk}$","$k=1..5:\\ \\text{rsi, rdx, rcx, r8, r9};\\quad k\\ge 6:\\ \\text{stack}$"],
 ans:6, tol:0.5,
 w:["rdi holder selve format-strengen. De neste fem argumentene ligger i rsi, rdx, rcx, r8, r9 → posisjon 1–5. Fra posisjon <b>6</b> leser printf fra stakken, der canary, returadresser og ofte brukerens egen buffer ligger.",
    "rdi holds the format string itself. The next five arguments are in rsi, rdx, rcx, r8, r9 → positions 1–5. From position <b>6</b> printf reads from the stack, where the canary, return addresses and often the user's own buffer live."]},

{id:"n2-06", t:2, s:"new", kind:"single",
 q:["Samme sårbare <code>printf(buf)</code> på x86-64. Hvilket register skriver <code>%3$p</code> ut?","Same vulnerable <code>printf(buf)</code> on x86-64. Which register does <code>%3$p</code> print?"],
 o:[["rdx","rdx"],["rcx","rcx"],["r8","r8"],["rdi","rdi"]],
 a:1,
 w:["Posisjon 1 = rsi, 2 = rdx, <b>3 = rcx</b>, 4 = r8, 5 = r9, 6+ = stakken. Merk at funksjonskall bruker rcx som 4. argument (syscalls bruker r10 der).",
    "Position 1 = rsi, 2 = rdx, <b>3 = rcx</b>, 4 = r8, 5 = r9, 6+ = stack. Note that function calls use rcx as the 4th argument (syscalls use r10 there)."],
 x:[["rdx er posisjon 2. Feilen kommer av å telle rdi som posisjon 1.","rdx is position 2. This mistake comes from counting rdi as position 1."],
    null,
    ["r8 er posisjon 4.","r8 is position 4."],
    ["rdi er format-strengen selv og har ingen <code>%k$p</code>-posisjon.","rdi is the format string itself and has no <code>%k$p</code> position."]]},

{id:"n2-07", t:2, s:"new", kind:"single",
 q:["Hva gjør <code>%n</code> i en format-streng?","What does <code>%n</code> do in a format string?"],
 o:[["Skriver ut en linjeskift","Prints a newline"],["Skriver ut neste argument som desimaltall","Prints the next argument as a decimal number"],["Skriver antall tegn skrevet så langt til adressen som neste argument peker på","Writes the number of characters printed so far to the address the next argument points to"],["Leser et tall fra stdin","Reads a number from stdin"]],
 a:2,
 w:["<code>%n</code> er en <b>skrive</b>-primitiv: den lagrer antall tegn som er skrevet hittil i <code>*(int*)arg</code>. Med kontroll over format-strengen og en adresse på stakken kan angriperen skrive valgfrie verdier til valgfrie adresser (f.eks. GOT eller returadresse). Mitigering: FORTIFY_SOURCE og full RELRO; riktig fiks er <code>printf(\"%s\", buf)</code>.",
    "<code>%n</code> is a <b>write</b> primitive: it stores the number of characters printed so far into <code>*(int*)arg</code>. With control of the format string and an address on the stack, the attacker can write chosen values to chosen addresses (e.g. the GOT or a return address). Mitigation: FORTIFY_SOURCE and full RELRO; the real fix is <code>printf(\"%s\", buf)</code>."],
 x:[["Linjeskift er <code>\\n</code>, ikke <code>%n</code>.","A newline is <code>\\n</code>, not <code>%n</code>."],
    ["Det er <code>%d</code>.","That is <code>%d</code>."],
    null,
    ["Det er <code>scanf</code>, ikke en printf-spesifikator.","That is <code>scanf</code>, not a printf specifier."]]},

{id:"n2-08", t:2, s:"new", kind:"single",
 q:["<b>ret2libc</b> på x86-64 (NX på, libc-basen kjent etter en lekkasje). Hvilken rekkefølge på stakken etter paddingen kaller <code>system(\"/bin/sh\")</code>?","<b>ret2libc</b> on x86-64 (NX on, libc base known from a leak). Which stack order after the padding calls <code>system(\"/bin/sh\")</code>?"],
 o:[["<code>system</code> → <code>pop rdi ; ret</code> → adressen til \"/bin/sh\"","<code>system</code> → <code>pop rdi ; ret</code> → address of \"/bin/sh\""],["<code>pop rdi ; ret</code> → adressen til \"/bin/sh\" → <code>system</code>","<code>pop rdi ; ret</code> → address of \"/bin/sh\" → <code>system</code>"],["Adressen til \"/bin/sh\" → <code>system</code>","Address of \"/bin/sh\" → <code>system</code>"],["<code>pop rsi ; ret</code> → adressen til \"/bin/sh\" → <code>system</code>","<code>pop rsi ; ret</code> → address of \"/bin/sh\" → <code>system</code>"]],
 a:1,
 w:["På x86-64 sendes 1. argument i <b>rdi</b>, så rdi må settes <i>før</i> <code>system</code> kjøres: gadget → verdien den popper → neste «gadget» (her funksjonen). Adressene er libc-base + offset, derfor trengs en lekkasje under ASLR. Noen ganger trengs en ekstra <code>ret</code> for 16-byte-justering.",
    "On x86-64 the 1st argument goes in <b>rdi</b>, so rdi must be set <i>before</i> <code>system</code> runs: gadget → the value it pops → next \"gadget\" (here the function). Addresses are libc base + offset, hence the leak under ASLR. Sometimes an extra <code>ret</code> is needed for 16-byte alignment."],
 x:[["system kjører før rdi er satt, med tilfeldig innhold i rdi.","system runs before rdi is set, with whatever is in rdi."],
    null,
    ["Det er 32-bit-stilen (argumenter på stakken). På x86-64 må argumentet i rdi.","That is the 32-bit style (arguments on the stack). On x86-64 the argument must be in rdi."],
    ["rsi er 2. argument; system leser kommandoen fra rdi.","rsi is the 2nd argument; system reads the command from rdi."]]},

{id:"n2-09", t:2, s:"new", kind:"single",
 q:["En funksjon er kompilert <b>med</b> stack canary. Hva er rekkefølgen i rammen fra lav til høy adresse (retningen en overflow skriver)?","A function is compiled <b>with</b> a stack canary. What is the order in the frame from low to high address (the direction an overflow writes)?"],
 o:[["buffer → lagret RBP → canary → returadresse","buffer → saved RBP → canary → return address"],["canary → buffer → lagret RBP → returadresse","canary → buffer → saved RBP → return address"],["buffer → canary → lagret RBP → returadresse","buffer → canary → saved RBP → return address"],["returadresse → lagret RBP → canary → buffer","return address → saved RBP → canary → buffer"]],
 a:2,
 w:["Stakken vokser mot lavere adresser, men en overflow skriver oppover. Canaryen legges <b>rett under lagret RBP</b>, så en lineær overflow må gå gjennom den før RBP og returadressen. Epilogen sammenligner den med originalen og kaller <code>__stack_chk_fail</code> ved endring.",
    "The stack grows towards lower addresses, but an overflow writes upwards. The canary sits <b>just below the saved RBP</b>, so a linear overflow must pass through it before reaching RBP and the return address. The epilogue compares it with the original and calls <code>__stack_chk_fail</code> if it changed."],
 x:[["Da kunne RBP overskrives uten å treffe canaryen; canaryen ligger under RBP.","Then RBP could be overwritten without hitting the canary; the canary sits below RBP."],
    ["En canary under bufferen beskytter ingenting, siden overflowen skriver oppover.","A canary below the buffer protects nothing, since the overflow writes upwards."],
    null,
    ["Dette er rekkefølgen fra høy til lav adresse, altså omvendt.","This is the order from high to low address, i.e. reversed."]]}
);
