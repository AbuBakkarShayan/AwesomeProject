// import React from 'react';
// import { StyleSheet, View, Dimensions } from 'react-native';
// import Pdf from 'react-native-pdf';

// const PDFReaderScreen = ({ route }) => {
//   const { pdfUrl } = route.params;

//   return (
//     <View style={styles.container}>
//       <Pdf
//         source={{ uri: pdfUrl, cache: true }}
//         onLoadComplete={(numberOfPages, filePath) => {
//           console.log(`Number of pages: ${numberOfPages}`);
//         }}
//         onPageChanged={(page, numberOfPages) => {
//           console.log(`Current page: ${page}`);
//         }}
//         onError={(error) => {
//           console.log(error);
//         }}
//         style={styles.pdf}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// });

// export default PDFReaderScreen;
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const PDFReaderScreen = () => {
//   return (
//     <View>
//       <Text>PDF</Text>
//     </View>
//   )
// }

// export default PDFReaderScreen

// const styles = StyleSheet.create({})

/**
 * Copyright (c) 2017-present, Wonday (@wonday.org)
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import React from 'react';
// import { StyleSheet, Dimensions, View } from 'react-native';
// import Pdf from 'react-native-pdf';

// export default class PDFExample extends React.Component {
//     render() {
//         const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };

//         return (
//             <View style={styles.container}>
//                 <Pdf
//                     source={source}
//                     onLoadComplete={(numberOfPages,filePath) => {
//                         console.log(`Number of pages: ${numberOfPages}`);
//                     }}
//                     onPageChanged={(page,numberOfPages) => {
//                         console.log(`Current page: ${page}`);
//                     }}
//                     onError={(error) => {
//                         console.log('PDF load error:', error);
//                     }}
//                     onPressLink={(uri) => {
//                         console.log(`Link pressed: ${uri}`);
//                     }}
//                     style={styles.pdf}/>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         marginTop: 25,
//     },
//     pdf: {
//         flex:1,
//         width:Dimensions.get('window').width,
//         height:Dimensions.get('window').height,
//     }
// });

//new
// import React from 'react';
// import { View } from 'react-native';
// import RNFS from 'react-native-fs';
// import Pdf from 'react-native-pdf';

// const PDFReaderScreen = ({ route }) => {
//     const { bookId } = route.params;
//     const pdfSource = `${RNFS.DocumentDirectoryPath}/${bookId}.pdf`;

//     return (
//         <View style={{ flex: 1 }}>
//             <Pdf
//                 source={{ uri: pdfSource, cache: true }}
//                 onLoadComplete={(numberOfPages, filePath) => {
//                     console.log(`Number of pages: ${numberOfPages}`);
//                 }}
//                 onPageChanged={(page, numberOfPages) => {
//                     console.log(`Current page: ${page}`);
//                 }}
//                 onError={(error) => {
//                     console.log(error);
//                 }}
//                 style={{ flex: 1 }}
//             />
//         </View>
//     );
// };

// export default PDFReaderScreen;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

const PDFReaderScreen = ({ route }) => {
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});

export default PDFReaderScreen;
