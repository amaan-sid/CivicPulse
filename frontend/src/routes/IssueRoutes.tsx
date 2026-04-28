import { useSelector } from "react-redux"
import type { RootState } from "../app/store"

import IssueDetails from "../pages/issues/IssueDetails"
import IssueAssign from "../pages/issues/IssueAssign"

function IssueRoute() {

  const user = useSelector((state: RootState) => state.auth.user)

  if (user?.role === "member") {
    return <IssueAssign />
  }

  return <IssueDetails />
}

export default IssueRoute