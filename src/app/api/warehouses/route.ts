import { http } from "@/lib/http";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { data } = await http.get("/remap/1.2/entity/store");

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: JSON.stringify(err) }, { status: 401 });
  }
};
