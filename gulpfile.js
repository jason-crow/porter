const gulp = require('gulp');
const rename = require('gulp-rename');
const transform = require('gulp-transform');

gulp.task('sort-deps', () => {
    return gulp.src("./port-data/todo.ts")
        .pipe(transform((contents, file) => {
            const dependencyLibrary = {};
            const classLibrary = {};
            const importLibrary = {};
            let glesStructs = [];
            let importedExternalStructs = [];
            const parts = contents.split("export");
            // parse imports
            let importBlocks = parts.shift();
            importBlocks = importBlocks.substring(0, importBlocks.lastIndexOf(";"));
            const imports = importBlocks.split("import").filter(Boolean);
            imports.forEach((v) => {
                let data = v.split("from");
                const importedStructs = data[0].replace(/ |{|}/g,'').split(",");
                const importPath = data[1].replace(/ |"|;/g,'');
                // determine if imports are from GLES folder
                if(importPath.startsWith("./")) glesStructs = glesStructs.concat(importedStructs);
                else importedExternalStructs = importedExternalStructs.concat(importedStructs);
            });
            let importedExternalSet = new Set(importedExternalStructs);
            let importedInternalSet = new Set(glesStructs);
            // parse classes
            const classBlocks = parts.filter((v) => v.includes("class")).map((v) => v.replace(/ /g,''));
            const enums = parts.filter((v) => v.includes("enum")).map((v) => v.replace(/ |const|enum/g,'').split("{")[0]);
            const namespaces = parts.filter((v) => v.includes("namespace")).map((v) => v.replace(/ |namespace/g,'').split("{")[0]);
            glesStructs = glesStructs.concat(enums);
            glesStructs = glesStructs.concat(namespaces);
            classBlocks.forEach((v, i) => {
                let classData = v.split("{")[0];
                classData = classData.split("extends");
                let parent = classData[1];
                let className = classData[0].substring(5);
                let dependencyData = v.split("{")[1];
                dependencyData = dependencyData.substring(0, dependencyData.indexOf("}")).trim();
                const dependencyBlocks = dependencyData.split("\n").map((k) => k.split(":")[1]).filter(Boolean);
                const dependencies = dependencyBlocks.map((j) => j.split(";")[0]);
                if(!!parent) dependencies.push(parent);
                dependencyLibrary[className] = dependencies;
                glesStructs.push(className);
                classLibrary[className] = { parent: parent, hasParent: !!parent, dependencies: dependencies } 
            });
            let glesStructSet = new Set(glesStructs);
            for(let className in classLibrary) {
                const classDef = classLibrary[className];
                classDef.name = className;
                let dependencySet = new Set(classDef.dependencies);
                let difference = new Set([...dependencySet].filter(x => !glesStructSet.has(x)));
                let internalDependencies = Array.from(new Set([...dependencySet].filter(x => !difference.has(x))));
                classDef.internalDependencies = internalDependencies;
                classDef.externalDependencies = Array.from(difference);
                classDef.hasExternalDependencies = classDef.externalDependencies.length > 0;
                
                classDef.remainingExternalDependencies = Array.from(new Set([...difference].filter(x => !importedExternalSet.has(x))));
                classDef.remainingInternalDependencies = Array.from(new Set([...internalDependencies].filter(x => !importedInternalSet.has(x))));
                classDef.remainingDependencies = classDef.remainingExternalDependencies.concat(classDef.remainingInternalDependencies);
                classDef.hasRemainingInternalDependencies = classDef.remainingInternalDependencies.length > 0;
                classDef.hasRemainingExternalDependencies = classDef.remainingExternalDependencies.length > 0;
                classDef.remainingInternalStr = "[ " + classDef.remainingInternalDependencies.join(",") + "]";
            }
            const classDefs = Object.values(classLibrary);
            let firstToPort = classDefs.filter((v) => !v.hasExternalDependencies && !v.hasRemainingInternalDependencies && !v.hasParent).map(v => v.name);
            let onlyInternalRemaining = classDefs.filter((v) => !v.hasExternalDependencies && !v.hasParent).sort((a,b) => a.remainingInternalDependencies.length >= b.remainingInternalDependencies).map(v => v.name + " " + v.remainingInternalStr);
            let firstToPortSet = new Set(firstToPort);
            onlyInternalRemaining = Array.from(new Set([...onlyInternalRemaining].filter(x => !firstToPortSet.has(x))));

            function addDeps(dep, deps) {
                const entry = classLibrary[dep];
                if(!deps.includes(dep)) deps.push(dep);
                if(!!entry) {
                    // remove redundant deps
                    let depsSet = new Set(deps);
                    let remaining = Array.from(new Set([...entry.remainingDependencies].filter(x => !depsSet.has(x))));
                    remaining.forEach((d) => addDeps(d, deps));
                }
            }

            function uniq(a) {
                var seen = {};
                return a.filter(function(item) {
                    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
                });
            }

            classDefs.forEach((c) => {
                let totalDeps = [];
                const deps = c.remainingDependencies;
                deps.forEach((d) => addDeps(d,totalDeps));
                c.totalRemainingInternalDeps = totalDeps.concat();
                c.totalRemainingDeps = uniq(totalDeps.concat(c.remainingExternalDependencies));
                c.hasAnyRelatedExternalDeps = totalDeps.filter(x => !!classLibrary[x]).length !== totalDeps.length;
            });

            function mySorter(a, b) {
                var x = a.totalRemainingDeps.length;
                var y = b.totalRemainingDeps.length;
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            classDefs.sort(mySorter);
            let results = "\nNO PARENT AND NO UNIMPLEMENTED EXTERNAL DEPENDENCIES\n";
            let noParentsNoExternalDeps = classDefs.filter((v) => !v.hasAnyRelatedExternalDeps);
            let noParentsNoExternalDepsSet = new Set(noParentsNoExternalDeps);
            let noParent = classDefs.filter((v) => !v.hasParent);
            let remainingNoParent = Array.from(new Set([...noParent].filter(x => !noParentsNoExternalDepsSet.has(x))));

            noParentsNoExternalDeps.forEach((v) => { results += "\t" + v.name + " [ " +  v.totalRemainingDeps.join(",") + "] \n"; });
            results += "\nSORTED BY NUMBER OF DEPENDENCIES\n";
            classDefs.forEach((v) => { results += "\t" + v.name + " [ " +  v.totalRemainingDeps.join(",") + "] \n"; });
            contents = results;
            
            return contents;
        },{encoding: 'utf8'}))
        .pipe(rename({ extname: '.txt' }))
        .pipe(gulp.dest('./port-result'));
});