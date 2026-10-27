import fs from 'node:fs'

const file = 'src/index.css'
let css = fs.readFileSync(file, 'utf8')
const before = css

const swaps = [
  // --- theme tokens: one scale, seven steps
  [
    `  --text-display: clamp(4.5rem, 11vw, 10.25rem);
  --text-display--line-height: 0.86;
  --text-display--letter-spacing: -0.05em;
  --text-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
  --text-head--line-height: 1.05;
  --text-head--letter-spacing: -0.03em;
  --text-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --text-lead--line-height: 1.45;
  --text-lead--letter-spacing: -0.01em;
  --text-prose: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --text-prose--line-height: 1.62;
  --text-micro: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --text-micro--line-height: 1.5;`,
    `  --text-display: clamp(4.5rem, 11vw, 10.25rem);
  --text-display--line-height: 0.86;
  --text-display--letter-spacing: -0.05em;
  --text-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
  --text-head--line-height: 1.05;
  --text-head--letter-spacing: -0.03em;
  --text-sub: clamp(1.75rem, 3vw, 2.75rem);
  --text-sub--line-height: 1.06;
  --text-sub--letter-spacing: -0.03em;
  --text-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --text-lead--line-height: 1.45;
  --text-lead--letter-spacing: -0.01em;
  --text-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --text-body--line-height: 1.62;
  --text-label: 0.9375rem;
  --text-label--line-height: 1.5;
  --text-small: 0.8125rem;
  --text-small--line-height: 1.5;`,
  ],
  // --- closeups
  [`    font-size: 1.125rem;
  }
  .closeup__caption span {
    font-size: 0.875rem;`, `    font-size: var(--text-body);
  }
  .closeup__caption span {
    font-size: var(--text-small);`],
  [`  .closeup__statement b {
    font-size: 1.125rem;
  }
  .closeup__statement span {
    font-size: 0.875rem;
  }`, `  .closeup__statement b {
    font-size: var(--text-body);
  }
  .closeup__statement span {
    font-size: var(--text-small);
  }`],
  [`    font-size: clamp(2.25rem, 4vw, 3.75rem);`, `    font-size: var(--text-sub);`],
  // --- bench
  [`  .bench__hint {
    font-size: 0.9375rem;`, `  .bench__hint {
    font-size: var(--text-label);`],
  // --- engine
  [`  .engine__intro p {
    font-size: var(--text-prose);`, `  .engine__intro p {
    font-size: var(--text-lead);`],
  [`    font-size: 1.25rem;`, `    font-size: var(--text-lead);`],
  [`  .engine__third p {
    font-size: 1rem;`, `  .engine__third p {
    font-size: var(--text-body);`],
  // --- platforms
  [`    font-size: clamp(1.75rem, 3vw, 2.75rem);`, `    font-size: var(--text-sub);`],
  [`    font-size: clamp(1.25rem, 1.5vw, 1.625rem);`, `    font-size: var(--text-lead);`],
  // --- speed
  [`    font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);`, `    font-size: var(--text-sub);`],
  [`    font-size: clamp(3.5rem, 5.6vw, 6rem);`, `    font-size: var(--text-head);`],
  [`  .speed__tile p {
    font-size: 1.0625rem;`, `  .speed__tile p {
    font-size: var(--text-body);`],
  // --- deck
  [`    font-size: clamp(2.5rem, 1.5rem + 3.6vw, 4rem);`, `    font-size: var(--text-head);`],
  [`  .deck-card h3 {
    font-size: 1.75rem;`, `  .deck-card h3 {
    font-size: var(--text-lead);`],
  [`  .deck-card p {
    font-size: 1.0625rem;`, `  .deck-card p {
    font-size: var(--text-body);`],
  [`  .deck-card__foot {
    font-size: 1rem;`, `  .deck-card__foot {
    font-size: var(--text-small);`],
  [`  .deck-progress {
    font-size: 1.375rem;`, `  .deck-progress {
    font-size: var(--text-body);`],
  [`  .deck-meta {
    font-size: 1.0625rem;`, `  .deck-meta {
    font-size: var(--text-body);`],
  // --- strip
  [`    font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem);`, `    font-size: var(--text-sub);`],
  [`  .strip__count {
    font-size: 1.0625rem;`, `  .strip__count {
    font-size: var(--text-body);`],
  // --- cta
  [`  .cta__fact dt {
    font-size: 0.8125rem;`, `  .cta__fact dt {
    font-size: var(--text-small);`],
  [`  .cta__fact dd {
    margin: 0;
    font-size: 1.0625rem;`, `  .cta__fact dd {
    margin: 0;
    font-size: var(--text-body);`],
  [`    font-size: clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem);`, `    font-size: var(--text-sub);`],
  [`  .cta__body p {
    font-size: 1.0625rem;`, `  .cta__body p {
    font-size: var(--text-body);`],
  // --- footer
  [`  .footer__col h3 {
    font-size: 0.9375rem;`, `  .footer__col h3 {
    font-size: var(--text-label);`],
  [`  .footer__col li {
    font-size: 0.9375rem;`, `  .footer__col li {
    font-size: var(--text-label);`],
  [`  .footer__contact {
    font-size: 0.9375rem;`, `  .footer__contact {
    font-size: var(--text-label);`],
  [`  .footer__credits {
    font-size: 0.8125rem;`, `  .footer__credits {
    font-size: var(--text-small);`],
  [`  .footer__last {
    font-size: 0.875rem;`, `  .footer__last {
    font-size: var(--text-small);`],
  [`  .footer__btn {
    font-size: 0.875rem;`, `  .footer__btn {
    font-size: var(--text-small);`],
  // --- generic
  [`  .code {
    font-size: 0.8125rem;`, `  .code {
    font-size: var(--text-small);`],
  [`  .caption {
    font-size: 0.8125rem;`, `  .caption {
    font-size: var(--text-small);`],
  [`  .btn {
    font-size: 0.9375rem;`, `  .btn {
    font-size: var(--text-label);`],
  [`  .hero__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(16px, 3.2vw, 48px);
    font-size: 0.9375rem;`, `  .hero__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(16px, 3.2vw, 48px);
    font-size: var(--text-label);`],
  // --- mobile overrides
  [`  .hero__statement {
    font-size: 1.125rem;
  }`, `  .hero__statement {
    font-size: var(--text-lead);
  }`],
  [`  .closeup__heading {
    font-size: 9vw;
  }`, `  .closeup__heading {
    font-size: var(--text-sub);
  }`],
  [`  .closeup__caption b {
    font-size: 1rem;
  }
  .closeup__caption span {
    font-size: 0.8125rem;
  }`, `  .closeup__caption b {
    font-size: var(--text-body);
  }
  .closeup__caption span {
    font-size: var(--text-small);
  }`],
  [`  .platforms__tile span {
    font-size: 1.25rem;
  }`, `  .platforms__tile span {
    font-size: var(--text-lead);
  }`],
  [`    font-size: 13vw;`, `    font-size: var(--text-head);`],
  [`  .speed__tile p {
    font-size: 0.9375rem;`, `  .speed__tile p {
    font-size: var(--text-body);
  }`],
]

let n = 0
for (const [from, to] of swaps) {
  const count = css.split(from).length - 1
  if (count !== 1) {
    console.error(`SKIP (${count} matches): ${from.split('\n')[0].trim()} -> ${to.split('\n')[0].trim()}`)
    continue
  }
  css = css.replace(from, to)
  n++
}

if (css === before) {
  console.error('nothing changed')
  process.exit(1)
}
fs.writeFileSync(file, css)
console.log(`applied ${n}/${swaps.length}`)
