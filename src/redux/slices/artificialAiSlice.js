import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as AI_SERVICE from '../../services/articficialInteligence';

export const fetchAiRquest = createAsyncThunk(
  'fetchAiRquest',
  async ({ url, header, payload }) => {
    const res = await AI_SERVICE.fetchAiRquest(url, header, payload);
    return res;
  }
);
