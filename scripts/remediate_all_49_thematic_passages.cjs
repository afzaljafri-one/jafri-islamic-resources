const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const filePath = path.join(repoRoot, 'src/platform/services/universalScriptureSearchService.ts');
let content = fs.readFileSync(filePath, 'utf8');

const MANDATORY_DISCLAIMER = 'This passage has been selected solely for its thematic relevance to this virtue. Inclusion does not imply any theological equivalence, syncretism, or doctrinal endorsement between traditions.';

const TRADITION_METADATA = {
  islam: {
    exactLicenceIdentifier: 'CC BY 3.0',
    rightsHolderOrPublisher: 'Tanzil Project (Arabic) / Global Public Domain (Yusuf Ali 1934)',
    canonicalTextRights: {
      componentName: 'Original Arabic (Uthmani Script)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'CC BY 3.0',
      rightsHolderOrPublisher: 'Tanzil Project (Hamid Zarrabi-Zadeh)',
      translatorOrSource: 'Tanzil Canonical Text',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (Abdullah Yusuf Ali 1934)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1934)',
      translatorOrSource: 'Abdullah Yusuf Ali',
      isAvailable: true,
    },
  },
  christianity: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Authorized King James Version 1611',
    canonicalTextRights: {
      componentName: 'The Holy Bible (King James Version 1611)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain (Worldwide Non-UK) / Crown Patent (UK)',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'Authorized King James Version (1611)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain (Worldwide Non-UK)',
      translatorOrSource: 'King James Translation Committee 1611',
      isAvailable: true,
    },
  },
  hinduism: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Mahabharata Bhishma Parva / Sir Edwin Arnold (1885)',
    canonicalTextRights: {
      componentName: 'Original Sanskrit (Bhagavad Gita)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Ancient Sanskrit Tradition (Bhishma Parva)',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (Sir Edwin Arnold 1885)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1885)',
      translatorOrSource: 'Sir Edwin Arnold',
      isAvailable: true,
    },
  },
  judaism: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Jewish Publication Society (1917)',
    canonicalTextRights: {
      componentName: 'Original Hebrew (Westminster Leningrad Codex)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Masoretic Hebrew Text (Public Domain)',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (Jewish Publication Society 1917)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Jewish Publication Society (1917 Public Domain)',
      translatorOrSource: 'JPS Translation Committee',
      isAvailable: true,
    },
  },
  sikhism: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1909)',
    canonicalTextRights: {
      componentName: 'Original Gurmukhi (Sri Guru Granth Sahib Ji)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Adi Granth Sacred Sikh Heritage',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (Max Arthur Macauliffe 1909)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1909)',
      translatorOrSource: 'Max Arthur Macauliffe',
      isAvailable: true,
    },
  },
  buddhism: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Sacred Books of the East (Clarendon Press Oxford 1881)',
    canonicalTextRights: {
      componentName: 'Original Pali (Tipitaka)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Theravada Pali Canon Heritage',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (F. Max Müller / T.W. Rhys Davids 1881)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1881)',
      translatorOrSource: 'F. Max Müller / T.W. Rhys Davids',
      isAvailable: true,
    },
  },
  jainism: {
    exactLicenceIdentifier: 'Public Domain',
    rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1884/1920)',
    canonicalTextRights: {
      componentName: 'Original Prakrit / Sanskrit (Agamas & Tattvartha)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Canonical Jain Tradition',
      isAvailable: true,
    },
    primaryTranslationRights: {
      componentName: 'English Translation (Jacobi 1884 / C.R. Jain 1920)',
      rightsStatus: 'VERIFIED',
      exactLicenceIdentifier: 'Public Domain',
      rightsHolderOrPublisher: 'Public Domain Worldwide (Published 1884/1920)',
      translatorOrSource: 'Hermann Jacobi / Champat Rai Jain',
      isAvailable: true,
    },
  },
};

const defStart = content.indexOf('public getThematicDefinitions()');
const defEnd = content.indexOf('public async search(');

let before = content.slice(0, defStart);
let block = content.slice(defStart, defEnd);
let after = content.slice(defEnd);

// Find each passage object inside verifiedPassages
// Pattern: {\s*id:\s*['"]theme_([a-z]{3})_([a-z]+)['"],[\s\S]*?\n\s*\},
// We match from id: 'theme_...' up to the closing `\n          },` or `\n          }`
const passageRegex = /\{\s*id:\s*['"](theme_([a-z]{3})_([a-z]+))['"],([\s\S]*?)\n\s*\},/g;

let count = 0;
block = block.replace(passageRegex, (match, fullId, relPrefix, themeName, body) => {
  count++;
  const relMap = {
    isl: 'islam',
    chr: 'christianity',
    hin: 'hinduism',
    jud: 'judaism',
    sik: 'sikhism',
    bud: 'buddhism',
    jai: 'jainism',
  };
  const religion = relMap[relPrefix];
  if (!religion || !TRADITION_METADATA[religion]) {
    console.error(`Unknown religion prefix: ${relPrefix}`);
    return match;
  }

  const meta = TRADITION_METADATA[religion];

  const cRightsStr = JSON.stringify(meta.canonicalTextRights, null, 2)
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : '            ' + line))
    .join('\n');

  const pRightsStr = JSON.stringify(meta.primaryTranslationRights, null, 2)
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : '            ' + line))
    .join('\n');

  let newBody = body;

  // 1. If canonicalTextRights is not present, add full rights fields
  if (!newBody.includes('canonicalTextRights:')) {
    newBody = `${newBody}
            exactLicenceIdentifier: '${meta.exactLicenceIdentifier}',
            rightsHolderOrPublisher: '${meta.rightsHolderOrPublisher}',
            rightsStatus: 'VERIFIED',
            thematicDisclaimer: '${MANDATORY_DISCLAIMER}',
            canonicalTextRights: ${cRightsStr},
            primaryTranslationRights: ${pRightsStr},`;
  } else {
    // 2. If already present, ensure thematicDisclaimer is present
    if (!newBody.includes('thematicDisclaimer:')) {
      newBody = newBody.replace(
        /canonicalTextRights:\s*\{/,
        `thematicDisclaimer: '${MANDATORY_DISCLAIMER}',\n            canonicalTextRights: {`
      );
    }
  }

  return `{\n            id: '${fullId}',${newBody}\n          },`;
});

console.log(`Remediated ${count} thematic passages in getThematicDefinitions().`);

fs.writeFileSync(filePath, before + block + after, 'utf8');
console.log('Successfully wrote updated universalScriptureSearchService.ts!');
