import { MainNav } from './mainNav'
import { UserNav } from './userNav'
import { BsThreeDots } from "react-icons/bs";

export default function Navbar() {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b">
          <MainNav />
        </div>
      </div>
    </>
  )
}