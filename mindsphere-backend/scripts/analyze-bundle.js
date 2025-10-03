#!/usr/bin/env node

/**
 * Bundle analysis script
 * Analyzes the built bundle and provides insights
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function analyzeDirectory(dirPath) {
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    files: [],
    extensions: {},
  };

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else {
        const ext = path.extname(item);
        const size = stat.size;
        
        stats.totalFiles++;
        stats.totalSize += size;
        
        stats.files.push({
          name: item,
          path: itemPath,
          size: size,
          extension: ext,
        });
        
        if (!stats.extensions[ext]) {
          stats.extensions[ext] = { count: 0, size: 0 };
        }
        
        stats.extensions[ext].count++;
        stats.extensions[ext].size += size;
      }
    });
  }

  scanDirectory(dirPath);
  return stats;
}

function analyzeBundle() {
  log('🔍 Analyzing bundle...', 'cyan');
  
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    log('❌ Dist directory not found. Run "npm run build" first.', 'red');
    process.exit(1);
  }

  const stats = analyzeDirectory(distPath);
  
  log('\n📊 Bundle Analysis Results:', 'bright');
  log('=' .repeat(50), 'blue');
  
  // Overall stats
  log(`\n📁 Total Files: ${stats.totalFiles}`, 'green');
  log(`📦 Total Size: ${formatBytes(stats.totalSize)}`, 'green');
  
  // Extension breakdown
  log('\n📋 File Types:', 'yellow');
  Object.entries(stats.extensions)
    .sort(([,a], [,b]) => b.size - a.size)
    .forEach(([ext, data]) => {
      const percentage = ((data.size / stats.totalSize) * 100).toFixed(1);
      log(`  ${ext || 'no extension'}: ${data.count} files, ${formatBytes(data.size)} (${percentage}%)`);
    });
  
  // Largest files
  log('\n🔝 Largest Files:', 'yellow');
  stats.files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach((file, index) => {
      log(`  ${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
    });
  
  // JavaScript files analysis
  const jsFiles = stats.files.filter(f => f.extension === '.js');
  if (jsFiles.length > 0) {
    log('\n📜 JavaScript Files:', 'yellow');
    const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    log(`  Total JS Size: ${formatBytes(totalJsSize)}`);
    log(`  JS Files Count: ${jsFiles.length}`);
    
    // Chunk analysis
    const chunks = jsFiles.filter(f => f.name.includes('chunk') || f.name.includes('vendor'));
    if (chunks.length > 0) {
      log('\n🧩 Chunks:', 'magenta');
      chunks.forEach(chunk => {
        log(`  ${chunk.name}: ${formatBytes(chunk.size)}`);
      });
    }
  }
  
  // CSS files analysis
  const cssFiles = stats.files.filter(f => f.extension === '.css');
  if (cssFiles.length > 0) {
    log('\n🎨 CSS Files:', 'yellow');
    const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    log(`  Total CSS Size: ${formatBytes(totalCssSize)}`);
    log(`  CSS Files Count: ${cssFiles.length}`);
  }
  
  // Asset files analysis
  const assetFiles = stats.files.filter(f => 
    ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'].includes(f.extension)
  );
  if (assetFiles.length > 0) {
    log('\n🖼️  Asset Files:', 'yellow');
    const totalAssetSize = assetFiles.reduce((sum, file) => sum + file.size, 0);
    log(`  Total Asset Size: ${formatBytes(totalAssetSize)}`);
    log(`  Asset Files Count: ${assetFiles.length}`);
    
    // Asset type breakdown
    const assetTypes = {};
    assetFiles.forEach(file => {
      if (!assetTypes[file.extension]) {
        assetTypes[file.extension] = { count: 0, size: 0 };
      }
      assetTypes[file.extension].count++;
      assetTypes[file.extension].size += file.size;
    });
    
    Object.entries(assetTypes).forEach(([ext, data]) => {
      log(`    ${ext}: ${data.count} files, ${formatBytes(data.size)}`);
    });
  }
  
  // Performance recommendations
  log('\n💡 Performance Recommendations:', 'cyan');
  
  const recommendations = [];
  
  // Check for large JavaScript files
  const largeJsFiles = jsFiles.filter(f => f.size > 100 * 1024); // 100KB
  if (largeJsFiles.length > 0) {
    recommendations.push(`Consider code splitting for large JS files: ${largeJsFiles.map(f => f.name).join(', ')}`);
  }
  
  // Check for large CSS files
  const largeCssFiles = cssFiles.filter(f => f.size > 50 * 1024); // 50KB
  if (largeCssFiles.length > 0) {
    recommendations.push(`Consider CSS optimization for large CSS files: ${largeCssFiles.map(f => f.name).join(', ')}`);
  }
  
  // Check for large asset files
  const largeAssets = assetFiles.filter(f => f.size > 500 * 1024); // 500KB
  if (largeAssets.length > 0) {
    recommendations.push(`Consider optimizing large assets: ${largeAssets.map(f => f.name).join(', ')}`);
  }
  
  // Check for too many chunks
  if (jsFiles.length > 20) {
    recommendations.push('Consider reducing the number of chunks for better caching');
  }
  
  // Check for missing gzip compression
  recommendations.push('Enable gzip compression on your server for better performance');
  
  // Check for missing CDN
  recommendations.push('Consider using a CDN for static assets');
  
  if (recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      log(`  ${index + 1}. ${rec}`, 'yellow');
    });
  } else {
    log('  ✅ Bundle looks well optimized!', 'green');
  }
  
  // Bundle size thresholds
  log('\n📏 Size Thresholds:', 'blue');
  const thresholds = {
    'Total Bundle': { size: stats.totalSize, good: 2 * 1024 * 1024, warning: 5 * 1024 * 1024 }, // 2MB good, 5MB warning
    'JavaScript': { size: jsFiles.reduce((sum, f) => sum + f.size, 0), good: 1 * 1024 * 1024, warning: 2 * 1024 * 1024 }, // 1MB good, 2MB warning
    'CSS': { size: cssFiles.reduce((sum, f) => sum + f.size, 0), good: 100 * 1024, warning: 200 * 1024 }, // 100KB good, 200KB warning
  };
  
  Object.entries(thresholds).forEach(([type, data]) => {
    const status = data.size <= data.good ? '✅' : data.size <= data.warning ? '⚠️' : '❌';
    const color = data.size <= data.good ? 'green' : data.size <= data.warning ? 'yellow' : 'red';
    log(`  ${status} ${type}: ${formatBytes(data.size)}`, color);
  });
  
  log('\n' + '=' .repeat(50), 'blue');
  log('Analysis complete! 🎉', 'green');
}

// Run analysis
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle, formatBytes };
