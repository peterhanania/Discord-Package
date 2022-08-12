import Utils from "../utils";
import { atom } from "jotai";

export const dataAtom = atom<any>(Utils.generateRandomData());

