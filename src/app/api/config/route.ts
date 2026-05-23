import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Read global configs
    const globalConfigPath = path.join(dataDir, 'global', 'config.json');
    const macrosConfigPath = path.join(dataDir, 'global', 'macros.json');
    
    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));
    const macrosConfig = JSON.parse(fs.readFileSync(macrosConfigPath, 'utf-8'));
    
    // Read subjects
    const subjectsDir = path.join(dataDir, 'subjects');
    const subjects: any[] = [];
    
    if (fs.existsSync(subjectsDir)) {
      const categories = fs.readdirSync(subjectsDir);
      
      for (const category of categories) {
        const categoryPath = path.join(subjectsDir, category);
        if (fs.statSync(categoryPath).isDirectory()) {
          const files = fs.readdirSync(categoryPath);
          for (const file of files) {
            if (file.endsWith('.json')) {
              const filePath = path.join(categoryPath, file);
              const subjectData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              subjects.push(subjectData);
            }
          }
        }
      }
    }
    
    return NextResponse.json({
      global: globalConfig,
      macros: macrosConfig,
      subjects: subjects
    });
  } catch (error) {
    console.error('Failed to load configurations:', error);
    return NextResponse.json({ error: 'Failed to load configurations' }, { status: 500 });
  }
}
