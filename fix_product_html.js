const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'product.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find the corrupted tabDesc duplicates
const targetString = `          </div>
          </div>
        </div>em;"><span style="color:var(--primary-hover);font-size:1.1rem;margin-top:-2px;">✦</span>`;

const indexOfCorrupt = content.indexOf(targetString);
if (indexOfCorrupt !== -1) {
  // Let's cut from here to the end of the duplicate block which is "</div>" before Tab: Ingredients
  const endMarker = '<!-- Tab: Ingredients -->';
  const endOfCorrupt = content.indexOf(endMarker, indexOfCorrupt);
  
  if (endOfCorrupt !== -1) {
    // We want to keep the closing of the active tab panel (which is </div> before Tab: Ingredients)
    // Actually the description tab is closed at line 786:
    // 784:               </div>
    // 785:             </div>
    // 786:           </div>
    // 787:           </div>
    // 788:         </div>em;"...
    // Let's replace the whole corrupt area from line 787 to the line before Tab: Ingredients.
    // The duplicate tabDesc ends with </div> right before <!-- Tab: Ingredients -->.
    // Let's inspect the block between indexOfCorrupt and endOfCorrupt.
    const corruptSegment = content.substring(indexOfCorrupt, endOfCorrupt);
    
    // We will replace indexOfCorrupt to endOfCorrupt with just a clean line feed and maybe spacing.
    const newContent = content.substring(0, indexOfCorrupt) + '\n        </div>\n\n        ' + content.substring(endOfCorrupt);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully cleaned up product.html duplicates!');
  } else {
    console.log('Could not find end marker!');
  }
} else {
  console.log('Could not find corrupt start marker!');
}
