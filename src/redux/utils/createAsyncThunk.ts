import { createAsyncThunk as plainCreateAsyncThunk } from '@reduxjs/toolkit';

import { IAppDispatch, IAppState } from '@redux/store.ts';

const createAsyncThunk = plainCreateAsyncThunk.withTypes<{
    state: IAppState;
    dispatch: IAppDispatch;
}>();

export default createAsyncThunk;
