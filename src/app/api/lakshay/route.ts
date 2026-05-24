import { NextRequest, NextResponse } from "next/server";
import resumeData from "./resumeData";

export async function GET(request: NextRequest) {
    return NextResponse.json(resumeData)
}