import { UserProfile } from '@clerk/nextjs'
// import styles from '../../../styles/User.module.css'
// import {APIRequest} from "../../api-request";

export const runtime = 'edge';

export default function Page() {
  return (
    <div className='text-black'>
      <h1 className='text-black'>Testing</h1>
      <UserProfile />

    </div>
  )
}
