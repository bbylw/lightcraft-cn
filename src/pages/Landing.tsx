import { Hero } from '../components/Hero'
import { Claims } from '../components/Claims'
import { Bench } from '../components/Bench'
import { Contents } from '../components/Contents'
import { Evidence } from '../components/Evidence'
import { ActionTile } from '../components/ActionTile'

export function Landing() {
  return (
    <>
      <Hero />
      <Claims />
      <Bench />
      <Contents />
      <Evidence />
      <ActionTile />
    </>
  )
}
