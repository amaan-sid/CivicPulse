import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Issue, CreateIssuePayload } from "./issueTypes"
import { fetchIssuesAPI, createIssueAPI } from "./issueAPI"

interface IssueState {
  issues: Issue[]
  loading: boolean
  error: string | null
  selectedIssue: Issue | null
}

const initialState: IssueState = {
  issues: [],
  loading: false,
  error: null,
  selectedIssue: null
}

export const fetchIssues = createAsyncThunk("issues/fetchAll", async (_, thunkAPI) => {
  try {
    return await fetchIssuesAPI()
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch issues")
  }
})

export const createIssue = createAsyncThunk(
  "issues/create",
  async (data: CreateIssuePayload, thunkAPI) => {
    try {
      return await createIssueAPI(data)
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create issue")
    }
  }
)

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setSelectedIssue: (state, action: PayloadAction<Issue>) => {
      state.selectedIssue = action.payload
    },
    clearSelectedIssue: (state) => {
      state.selectedIssue = null
    }
  },
  extraReducers: (builder) => {
    // Fetch issues
    builder.addCase(fetchIssues.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.loading = false
      state.issues = action.payload.issues || action.payload
    })
    builder.addCase(fetchIssues.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Create issue
    builder.addCase(createIssue.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createIssue.fulfilled, (state, action) => {
      state.loading = false
      state.issues.unshift(action.payload.issue || action.payload)
    })
    builder.addCase(createIssue.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { setSelectedIssue, clearSelectedIssue } = issueSlice.actions
export default issueSlice.reducer
