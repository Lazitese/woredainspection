const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const schemas = [
  {
    id: "form_01",
    table_title: "ቅጽ 01፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ በየደረጃው የተዋቀረ የኮሚሽን መዋቅር የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ወረዳ",
        subKeys: ["ብዛት", "ያዋቀሩ", "ያላዋቀሩ"]
      },
      {
        key: "በብልፅግና ህብረት ደረጃ",
        subKeys: ["ብዛት", "ያዋቀሩ", "ያላዋቀሩ"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["ብዛት", "ያዋቀሩ", "ያላዋቀሩ"]
      },
      {
        key: "ያዋቀሩ %",
        subKeys: []
      }
    ]
  },
  {
    id: "form_02",
    table_title: "ቅጽ 02፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ በየደረጃው የሚገኙ የኮሚሽን አባላት የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የወረዳ ኮሚሽን",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "የብልፅግና ህብረት ኮሚሽን",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["ወ", "ሴ", "ድ"]
      }
    ]
  },
  {
    id: "form_03",
    table_title: "ቅጽ 03፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ የኮሚሽኑ ቅርንጫፍ ጽ/ቤት ቋሚ የሰው ሀይል የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የወረዳ ኮሚሽን ጽ/ቤት",
        subKeys: ["ጽ/ኃ", "ም/ክ", "ባለሙ", "ጸሐ", "ሹፌ", "ድም"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["ጽ/ኃ", "ም/ክ", "ባለሙ", "ጸሐ", "ሹፌ", "ድም"]
      }
    ]
  },
  {
    id: "form_04",
    table_title: "ቅጽ 04፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ የኮሚሽን ቅርንጫፍ ጽ/ቤት የስራ ክፍል የሚያሣይ ሠንጠረዥ",
    columns: [
      {
        key: "የወረዳ ቅ/ጽ/ቤት",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["እቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_04_1",
    table_title: "ቅጽ 04-1፡ በ{year} በጀት ዓመት 3ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ በየደረጃው ለሚገኙ የኮሚሽን መዋቅሮች የተመደበ በጀት የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ለወረዳ",
        subKeys: ["ብር", "ሣ"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["ብር", "ሣ"]
      }
    ]
  },
  {
    id: "form_05",
    table_title: "ቅጽ 05፡ የ{year} በጀት ዓመት እቅድ ያዘጋጁ በየደረጃው የሚገኙ የኮሚሽን መዋቅሮች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ወረዳ ኮሚሽን",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት ኮሚሽን",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["እቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_06",
    table_title: "ቅጽ 06፡ የ{year} በጀት ዓመት እቅድ ላይ ኦረንቴሽን የሰጡ የኮሚሽን መዋቅሮች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ወረዳ",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት ኮሚሽን",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["እቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_06_1",
    table_title: "ቅጽ 06-1፡ በ{year} በጀት ዓመት የእቅድ ኦረንቴሽን ላይ የተሳተፉ የኮሚሽን ቤተሠብ ብዛት የሚየሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "በብልጽግና ህብረት ኮሚሽን",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "ምርመራ",
        subKeys: []
      }
    ]
  },
  {
    id: "form_07",
    table_title: "ቅጽ 07፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ መጋቢት 25 ድረስ ለኮሚሽን ጽ/ቤት ኃላፊና ለኮሚሽን አባላት የተሰጡ የግንዛቤ ማስጨበጫ ስልጠና የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "በብልጽግና ህብረት ኮሚሽን",
        subKeys: ["ወ", "ሴ", "ድ"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["ወ", "ሴ", "ድ"]
      }
    ]
  },
  {
    id: "form_08",
    table_title: "ቅጽ 08፡ የ{year} በጀት ዓመት 3ኛ ሩብ ዓመት ሪፖርት በየደረጃው ለሚገኙ የኮሚሽን መዋቅሮች ያቀረቡ የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ለወረዳ የላኩ የብልጽግና ህብረት",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "ለአባላት ኮንፈረንስ ሪፖርት ያቀረቡ የኮሚሽን መዋቅር ብዛት",
        subKeys: ["ከተማ", "በክፍለ ከተማ ወረዳ 1 ጊዜ", "ወረዳ 1 ጊዜ", "ህብረት 1 ጊዜ", "ጠቅላላ ድምር"]
      }
    ]
  },
  {
    id: "form_09",
    table_title: "ቅጽ 09፡ በ{year} በጀት ዓመት የ3ኛ ሩብ ዓመት ኢንስፔክሽን ያካሄዱ የኮሚሽን መዋቅሮች ብዛት የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_10",
    table_title: "ቅጽ 10፡ በ{year} በጀት ዓመት የ3ኛ ሩብ ዓመት ግምገማ ያካሄዱ የኮሚሽን መዋቅሮች ብዛት የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_11",
    table_title: "ቅጽ 11፡ በ{year} በጀት ዓመት የ3ኛ ሩብ ዓመት የግኝቶች ግብረ መልስ ለፓርቲ ቅርንጫፍ ጽ/ቤት የሰጡ የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_12",
    table_title: "ቅጽ 12፡ በ{year} በጀት ዓመት 3ኛ ሩብ ዓመት እስከ መጋቢት 25 በየደረጃው ለሚገኙ የፓርቲ አመራርና አባላት የተሰጡ ስልጠናዎች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "በብልጽግና ህብረት ደረጃ",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      },
      {
        key: "አጠቃላይ ድምር",
        subKeys: ["ዕቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_13",
    table_title: "ቅጽ 13፡ በ{year} በጀት ዓመት 3ኛ ሩብ ዓመት እስከ መጋቢት 25 ድረስ የፓርቲ አባላት፣ የብልፅግና ህብረትና ቤተሰብ መረጃ የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የፓርቲ አባላት ብዛት",
        subKeys: ["ወንድ", "ሴት", "ድምር"]
      },
      {
        key: "አባላት የተደራጁበት አሃድ ብዛት",
        subKeys: ["የብልፅግና ቤተሰብ ብዛት", "የብልፅግና ህብረት ብዛት"]
      },
      {
        key: "ከአጠቃላይ የአባላት ብዛት ወደ ዳታ ቤዝ የገባ መረጃ ብዛት",
        subKeys: ["ወ", "ሴ", "ድ", "%"]
      }
    ]
  },
  {
    id: "form_14",
    table_title: "ቅጽ 14፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ መጋቢት 25 ድረስ በፓርቲ ቅ/ጽ/ቤት በአባላትና አመራር ላይ የተወሰዱ ርምጃዎች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በ2ኛ ሩብ ዓመት የተወሰዱ እርምጃዎች",
        subKeys: ["ተግሣጽ", "የቃል ማስጠንቀቂያ", "የጽሐፍ ማስጠንቀቂያ", "ከሃላፊነት ዝቅ ማድረግ", "ከሃላፊነት ማንሳት", "ከሃላፊነት ማገድ", "ከአባልነት መሠረዝ", "ጠቅላላ ድምር"]
      },
      {
        key: "ከአባልነት ከተሰረዙ ውስጥ በኮንፈረንስ ቀርቦ የጸደቀ",
        subKeys: ["ብዛት", "%"]
      }
    ]
  },
  {
    id: "form_15",
    table_title: "ቅጽ 15፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ መጋቢት 25 ድረስ በየደረጃው ለሚገኙ የፓርቲ መዋቅሮች የቀረቡ ቅሬታዎችና አፈጻጸም የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የቀረቡ ቅሬታዎችና አፈጻጸም",
        subKeys: ["የቀረቡ", "የተፈቱ", "በሂደት ያሉ", "ሌላ", "ድምር"]
      },
      {
        key: "ምርመራ",
        subKeys: []
      }
    ]
  },
  {
    id: "form_15_1",
    table_title: "ቅጽ 15-1፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ ታህሳስ 25 ድረስ በየደረጃው ለሚገኙ የኮሚሽን መዋቅሮች የቀረቡ አቤቱታዎች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የቀረቡ አቤቱታዎችና አፈጻጸማቸው",
        subKeys: ["የቀረቡ", "ውሳኔ ያገኙ", "በሂደት ያሉ", "የተመለሱ", "ኮሚሽን የማይመለከት"]
      },
      {
        key: "በኮሚሽኑ የተሰጡ ውሳኔዎች",
        subKeys: ["የጸነ", "የተሻረ", "የተሻሻለ", "ድምር"]
      },
      {
        key: "በኮሚሽኑ ከተሰጡ ውሳኔዎች በፓርቲ መዋቅር",
        subKeys: ["የተፈጸመ", "ያልተፈጸመ", "በሂደት ያለ", "ድምር"]
      }
    ]
  },
  {
    id: "form_16",
    table_title: "ቅጽ 16፡ በ{year} በጀት ዓመት 2ኛ ሩብ ዓመት እስከ መጋቢት 25 ድረስ የፓርቲ ቅ/ጽ/ቤት ተመዝግበው የሚገኙ የፓርቲ ሀብቶች የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ቋሚ ንብረት",
        subKeys: ["በክፍለ ከተማ", "ወረዳ", "ድምር"]
      },
      {
        key: "ልዩ ተንቀሳቃሽ ንብረት",
        subKeys: ["በክፍለ ከተማ", "ወረዳ", "ድምር"]
      },
      {
        key: "ጠቅላላ የተመዘገበ ንብረት ብዛት",
        subKeys: ["በክፍለ ከተማ", "ወረዳ", "ድምር"]
      }
    ]
  },
  {
    id: "form_17",
    table_title: "ቅጽ 17፡ በ{year} በጀት ዓመት የፓርቲ ሀብቶች በውጭ ኦዲት ያስመረመሩ የፓርቲ ቅ/ጽ/ቤት የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["2015", "2016", "2017"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["2015", "2016", "2017"]
      },
      {
        key: "በሶስቱ ዓመት የኦዲት ግኝቶችና የማስተካከያ ርምጃዎች",
        subKeys: ["ጉድለት[በብር]", "የተመለሰ", "ያልተመለሰ"]
      }
    ]
  },
  {
    id: "form_17_1",
    table_title: "ቅጽ 17-1፡ በ{year} በጀት እስከ 3ኛ ሩብ ዓመት ድረስ በየደረጃው በሚገኙ የፓርቲ ቅ/ጽ/ቤት የውስጥ ኦዲት ያስደረጉ የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "በወረዳ ደረጃ",
        subKeys: ["እቅድ", "ክንውን", "በ%"]
      },
      {
        key: "ጠቅላላ ድምር",
        subKeys: ["እቅድ", "ክንውን", "በ%"]
      },
      {
        key: "ጠቅላላ የኦዲት ግኝቶች በብር",
        subKeys: ["ጉድለት", "የተመለሰ", "ያልተመለሰ"]
      }
    ]
  },
  {
    id: "form_18",
    table_title: "ቅጽ 18፡ በየደረጃው በሚገኙ የፓርቲ ጽ/ቤት በ{year} በጀት እስከ መጋቢት 25 ድረስ የፓርቲ ገቢ አሰባሰብ አፈጻጸም የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "የአባልነት መዋጮ ገቢ",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "ልዩ ልዩ ገቢ(ድጋፍ፣ የመደመር መንግስት፤የመጽሄት ሽያጭ፣ ውዝፍ)",
        subKeys: ["እቅድ", "ክንውን", "%"]
      },
      {
        key: "ለዋና ጽ/ቤት ፈሰስ %20 የተደረገ",
        subKeys: ["እቅድ", "ክንውን", "%"]
      }
    ]
  },
  {
    id: "form_19",
    table_title: "ቅጽ 19፡ የወረዳ ኮሚሽን ቅርንጫፍ ጽ/ቤት ደረጃ የአካላት የመደበኛ የግንኙነት አፈጻጸም መረጃ ማጠናቀሪያ ቅፅ",
    columns: [
      {
        key: "የኮሚሽን መድረክ",
        subKeys: ["እቅድ", "ክንውን"]
      },
      {
        key: "የኮሚሽን ሥራ አመራር ኮሚቴ መድረክ",
        subKeys: ["እቅድ", "ክንውን"]
      },
      {
        key: "የኮሚሽኑ ቅ/ጽ/ቤት ማኔጅመንት ኮሚቴ መድረክ",
        subKeys: ["እቅድ", "ክንውን"]
      },
      {
        key: "ለክልል ተጠሪ ከሆኑ ከዞን/ከተማ/ልዩ ወረዳ ኮሚሽን ጋር የተደረገ መድረክ",
        subKeys: ["እቅድ", "ክንውን"]
      },
      {
        key: "ለክልል ተጠሪ ከሆኑ የዞን/ከተማ/ልዩ ወረዳ የኮሚሽን ቅ/ጽ/ቤት ኃላፊዎች ጋር የተደረገ መድረክ",
        subKeys: ["እቅድ", "ክንውን"]
      },
      {
        key: "ከክልል/ከተማ ፓርቲ ቅ/ጽ/ቤት ሥራ አመራር ኮሚቴ ጋር የተደረገ",
        subKeys: ["እቅድ", "ክንውን"]
      }
    ]
  },
  {
    id: "form_20",
    table_title: "ቅጽ 20፡ በኮሚሽኑ በ{year} በጀት ዓመት እስከ ታህሳስ 25 ድረስ የተመዘገቡ ውጤቶች አፈጻጸም የሚያሳይ ሠንጠረዥ",
    columns: [
      {
        key: "ለፓርቲ ቅ/ጽ/ቤት እንዲያርሙ ግብረ-መልስ የተሰጠ የተጣሱ የአሰራር ሥርዓቶች ብዛት",
        subKeys: []
      },
      {
        key: "ከአባልነት ተባረው የተመለሱ ብዛት",
        subKeys: []
      },
      {
        key: "ከኃላፊነት ተነስተው የተመለሱ አመራሮች ብዛት",
        subKeys: []
      },
      {
        key: "በኢንስፔክሽን የተገኘ የፓርቲ መዋጮ የማይከፍሉ አባላት",
        subKeys: ["ብዛት", "ብር"]
      },
      {
        key: "ለሌላ ዓላማ ውሎ የነበረ የተመለሰ የፓርቲ ገንዘብ ብዛት በብር",
        subKeys: []
      },
      {
        key: "ኦዲት እንዲያስደርጉ የተደረገ የፓርቲ ቅ/ጽ/ቤት ብዛት",
        subKeys: []
      },
      {
        key: "እንዲመለስ የተደረገ የኦዲት ግኝቶች በብር",
        subKeys: []
      },
      {
        key: "የፓርቲ ንብረት እንዲመዘግቡ የተደረገ የፓርቲ ቅ/ጽ/ቤቶች",
        subKeys: ["ብዛት", "ንብረት"]
      },
      {
        key: "ሌላ ካለ ይጨመር",
        subKeys: []
      }
    ]
  }
];

// 1. Write formatted JSON to src/data/forms-schema.json
const schemaFilePath = path.join(__dirname, '../src/data/forms-schema.json');
fs.writeFileSync(schemaFilePath, JSON.stringify(schemas, null, 2), 'utf8');
console.log(`Saved ${schemas.length} schemas to src/data/forms-schema.json`);

// 2. Generate migration SQL with clean replacement (delete old, insert new)
let sql = `-- Seed and update form schemas with the real 24 Woreda report forms\n`;
sql += `DELETE FROM public.form_schemas;\n\n`;
sql += `INSERT INTO public.form_schemas (id, table_title, columns, updated_at)\nVALUES\n`;

const values = schemas.map(form => {
  const id = form.id.replace(/'/g, "''");
  const title = form.table_title.replace(/'/g, "''");
  const cols = JSON.stringify(form.columns).replace(/'/g, "''");
  return `  ('${id}', '${title}', '${cols}'::jsonb, NOW())`;
});

sql += values.join(',\n');
sql += `;\n`;

const migrationPath = path.join(__dirname, '../supabase/migrations/20260709094600_seed_form_schemas.sql');
fs.writeFileSync(migrationPath, sql, 'utf8');
console.log(`Saved migration to ${migrationPath}`);

// 3. Directly update Supabase database using supabase admin
async function updateDb() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8').replace(/\r\n/g, '\n');
  const getEnv = (key) => {
    const lines = envContent.split('\n');
    const line = lines.find(l => l.startsWith(key + '='));
    return line ? line.slice(key.length + 1).trim() : null;
  };

  const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Clear existing schemas
  const { error: delErr } = await supabase.from('form_schemas').delete().neq('id', 'non_existent');
  if (delErr) {
    console.error('Error clearing form_schemas:', delErr);
    return;
  }
  console.log('Cleared old form_schemas');

  // Insert new 24 schemas
  const rowsToInsert = schemas.map(s => ({
    id: s.id,
    table_title: s.table_title,
    columns: s.columns,
    updated_at: new Date().toISOString()
  }));

  const { data, error: insErr } = await supabase.from('form_schemas').insert(rowsToInsert).select('id');
  if (insErr) {
    console.error('Error inserting new form_schemas:', insErr);
    return;
  }
  console.log(`Successfully synced ${data.length} form schemas to database!`);
}

updateDb().catch(console.error);
