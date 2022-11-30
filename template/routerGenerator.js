const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
    {
    option:'Create Router',
    deafaultCase : '(pascalCase)',
    entry:{
        folderPath:'./router',
    },
    stringReplacers:[ { question: 'Insert router name', slot: '__pathName__' }]
    }
])