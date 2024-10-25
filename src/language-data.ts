import {LanguageSupport, LanguageDescription, StreamParser, StreamLanguage} from "@codemirror/language"

function legacy(parser: StreamParser<unknown>): LanguageSupport {
  return new LanguageSupport(StreamLanguage.define(parser))
}

function sql(dialectName: keyof typeof import("@codemirror/lang-sql")) {
  return import("@codemirror/lang-sql").then(m => m.sql({dialect: (m as any)[dialectName]}))
}

function ofLegacy(spec) {
  let ld: LanguageDescription
  if (!spec.load) {
    if (spec.loadName) {
      const name: string = spec.loadName.toLowerCase()
      spec.load = () => import("@codemirror/legacy-modes/mode/" + name).then(m => legacy(m[spec.loadName]))
    }
    else {
      const name: string = spec.name.toLowerCase()
      spec.load = () => import("@codemirror/legacy-modes/mode/" + name).then(m => legacy(m[name]))
    }
  }
  ld = LanguageDescription.of(spec)
  ld.module = "@codemirror/legacy-modes"
  ld.legacy = 1
  return ld
}

function of(spec) {
  let ld: LanguageDescription
  const module: string = spec.module || ("@codemirror/lang-" + spec.name.toLowerCase())
  if (!spec.load) {
    if (spec.loadName)
      spec.load = () => import(module).then(m => m[spec.loadName]())
    else
      spec.load = () => import(module).then(m => m[spec.name.toLowerCase()]())
  }
  ld = LanguageDescription.of(spec)
  ld.module = module
  return ld
}

/// An array of language descriptions for known language packages.
export const languages = [
  // New-style language modes
  of({
    name: "C",
    extensions: ["c","h","ino"],
    module: "@codemirror/lang-cpp",
    loadName: "cpp"
  }),
  of({
    name: "C++",
    alias: ["cpp"],
    extensions: ["cpp","c++","cc","cxx","hpp","h++","hh","hxx"],
    module: "@codemirror/lang-cpp",
    loadName: "cpp"
  }),
  of({
    name: "CQL",
    alias: ["cassandra"],
    extensions: ["cql"],
    module: "@codemirror/lang-sql",
    load() { return sql("Cassandra") }
  }),
  of({
    name: "CSS",
    extensions: ["css"],
  }),
  of({
    name: "Go",
    extensions: ["go"],
  }),
  of({
    name: "HTML",
    alias: ["xhtml"],
    extensions: ["html", "htm", "handlebars", "hbs"],
  }),
  of({
    name: "Java",
    extensions: ["java"],
  }),
  of({
    name: "JavaScript",
    alias: ["ecmascript","js","node"],
    extensions: ["js", "mjs", "cjs"]
  }),
  of({
    name: "JSON",
    alias: ["json5"],
    extensions: ["json","map"]
  }),
  of({
    name: "JSX",
    extensions: ["jsx"],
    module: "@codemirror/lang-javascript",
    load() {
      return import("@codemirror/lang-javascript").then(m => m.javascript({jsx: true}))
    }
  }),
  of({
    name: "LESS",
    extensions: ["less"],
  }),
  of({
    name: "Liquid",
    extensions: ["liquid"],
  }),
  of({
    name: "MariaDB SQL",
    module: "@codemirror/lang-sql",
    load() { return sql("MariaSQL") }
  }),
  of({
    name: "Markdown",
    extensions: ["md", "markdown", "mkd"],
  }),
  of({
    name: "MS SQL",
    module: "@codemirror/lang-sql",
    load() { return sql("MSSQL") }
  }),
  of({
    name: "MySQL",
    module: "@codemirror/lang-sql",
    load() { return sql("MySQL") }
  }),
  of({
    name: "PHP",
    extensions: ["php", "php3", "php4", "php5", "php7", "phtml"],
  }),
  of({
    name: "PLSQL",
    extensions: ["pls"],
    module: "@codemirror/lang-sql",
    load() { return sql("PLSQL") }
  }),
  of({
    name: "PostgreSQL",
    module: "@codemirror/lang-sql",
    load() { return sql("PostgreSQL") }
  }),
  of({
    name: "Python",
    extensions: ["BUILD","bzl","py","pyw"],
    filename: /^(BUCK|BUILD)$/,
  }),
  of({
    name: "Rust",
    extensions: ["rs"],
  }),
  of({
    name: "Sass",
    extensions: ["sass"],
  }),
  of({
    name: "SCSS",
    extensions: ["scss"],
    module: "@codemirror/lang-sass",
    loadName: "sass"
  }),
  of({
    name: "SQL",
    extensions: ["sql"],
    module: "@codemirror/lang-sql",
    load() { return sql("StandardSQL") }
  }),
  of({
    name: "SQLite",
    module: "@codemirror/lang-sql",
    load() { return sql("SQLite") }
  }),
  of({
    name: "TSX",
    extensions: ["tsx"],
    module: "@codemirror/lang-javascript",
    load() {
      return import("@codemirror/lang-javascript").then(m => m.javascript({jsx: true, typescript: true}))
    }
  }),
  of({
    name: "TypeScript",
    alias: ["ts"],
    extensions: ["ts","mts","cts"],
    module: "@codemirror/lang-javascript",
    load() {
      return import("@codemirror/lang-javascript").then(m => m.javascript({typescript: true}))
    }
  }),
  of({
    name: "WebAssembly",
    extensions: ["wat","wast"],
    module: "@codemirror/lang-wast",
    loadName: "wast"
  }),
  of({
    name: "XML",
    alias: ["rss","wsdl","xsd"],
    extensions: ["xml","xsl","xsd","svg"],
  }),
  of({
    name: "YAML",
    alias: ["yml"],
    extensions: ["yaml","yml"],
  }),

  // Legacy modes ported from CodeMirror 5

  ofLegacy({
    name: "APL",
    extensions: ["dyalog","apl"],
  }),
  ofLegacy({
    name: "PGP",
    alias: ["asciiarmor"],
    extensions: ["asc","pgp","sig"],
    loadName: "asciiArmor"
  }),
  ofLegacy({
    name: "ASN.1",
    extensions: ["asn","asn1"],
    loadName: "asn1"
  }),
  ofLegacy({
    name: "Asterisk",
    filename: /^extensions\.conf$/i,
  }),
  ofLegacy({
    name: "Brainfuck",
    extensions: ["b","bf"],
  }),
  ofLegacy({
    name: "Cobol",
    extensions: ["cob","cpy"],
  }),
  ofLegacy({
    name: "C#",
    alias: ["csharp","cs"],
    extensions: ["cs"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.csharp))
    }
  }),
  ofLegacy({
    name: "Clojure",
    extensions: ["clj","cljc","cljx"],
  }),
  ofLegacy({
    name: "ClojureScript",
    extensions: ["cljs"],
    loadName: "clojure"
  }),
  ofLegacy({
    name: "Closure Stylesheets (GSS)",
    extensions: ["gss"],
    load() {
      return import("@codemirror/legacy-modes/mode/css").then(m => legacy(m.gss))
    }
  }),
  ofLegacy({
    name: "CMake",
    extensions: ["cmake","cmake.in"],
    filename: /^CMakeLists\.txt$/,
  }),
  ofLegacy({
    name: "CoffeeScript",
    alias: ["coffee","coffee-script"],
    extensions: ["coffee"],
    loadName: "coffeeScript"
  }),
  ofLegacy({
    name: "Common Lisp",
    alias: ["lisp"],
    extensions: ["cl","lisp","el"],
    loadName: "commonLisp"
  }),
  ofLegacy({
    name: "Cypher",
    extensions: ["cyp","cypher"]
  }),
  ofLegacy({
    name: "Cython",
    extensions: ["pyx","pxd","pxi"],
    load() {
      return import("@codemirror/legacy-modes/mode/python").then(m => legacy(m.cython))
    }
  }),
  ofLegacy({
    name: "Crystal",
    extensions: ["cr"],
  }),
  ofLegacy({
    name: "D",
    extensions: ["d"],
  }),
  ofLegacy({
    name: "Dart",
    extensions: ["dart"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.dart))
    }
  }),
  ofLegacy({
    name: "diff",
    extensions: ["diff","patch"],
  }),
  ofLegacy({
    name: "Dockerfile",
    filename: /^Dockerfile$/,
    loadName: "dockerFile"
  }),
  ofLegacy({
    name: "DTD",
    extensions: ["dtd"],
  }),
  ofLegacy({
    name: "Dylan",
    extensions: ["dylan","dyl","intr"],
  }),
  ofLegacy({
    name: "EBNF",
  }),
  ofLegacy({
    name: "ECL",
    extensions: ["ecl"],
  }),
  ofLegacy({
    name: "edn",
    extensions: ["edn"],
    load() {
      return import("@codemirror/legacy-modes/mode/clojure").then(m => legacy(m.clojure))
    }
  }),
  ofLegacy({
    name: "Eiffel",
    extensions: ["e"],
  }),
  ofLegacy({
    name: "Elm",
    extensions: ["elm"],
  }),
  ofLegacy({
    name: "Erlang",
    extensions: ["erl"],
  }),
  ofLegacy({
    name: "Esper",
    load() {
      return import("@codemirror/legacy-modes/mode/sql").then(m => legacy(m.esper))
    }
  }),
  ofLegacy({
    name: "Factor",
    extensions: ["factor"],
  }),
  ofLegacy({
    name: "FCL",
  }),
  ofLegacy({
    name: "Forth",
    extensions: ["forth","fth","4th"],
  }),
  ofLegacy({
    name: "Fortran",
    extensions: ["f","for","f77","f90","f95"],
  }),
  ofLegacy({
    name: "F#",
    alias: ["fsharp"],
    extensions: ["fs"],
    load() {
      return import("@codemirror/legacy-modes/mode/mllike").then(m => legacy(m.fSharp))
    }
  }),
  ofLegacy({
    name: "Gas",
    extensions: ["s"],
  }),
  ofLegacy({
    name: "Gherkin",
    extensions: ["feature"],
  }),
  ofLegacy({
    name: "Groovy",
    extensions: ["groovy","gradle"],
    filename: /^Jenkinsfile$/,
  }),
  ofLegacy({
    name: "Haskell",
    extensions: ["hs"],
  }),
  ofLegacy({
    name: "Haxe",
    extensions: ["hx"],
  }),
  ofLegacy({
    name: "HXML",
    extensions: ["hxml"],
    load() {
      return import("@codemirror/legacy-modes/mode/haxe").then(m => legacy(m.hxml))
    }
  }),
  ofLegacy({
    name: "HTTP",
  }),
  ofLegacy({
    name: "IDL",
    extensions: ["pro"],
  }),
  ofLegacy({
    name: "JSON-LD",
    alias: ["jsonld"],
    extensions: ["jsonld"],
    load() {
      return import("@codemirror/legacy-modes/mode/javascript").then(m => legacy(m.jsonld))
    }
  }),
  ofLegacy({
    name: "Jinja2",
    extensions: ["j2","jinja","jinja2"],
  }),
  ofLegacy({
    name: "Julia",
    extensions: ["jl"],
  }),
  ofLegacy({
    name: "Kotlin",
    extensions: ["kt", "kts"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.kotlin))
    }
  }),
  ofLegacy({
    name: "LiveScript",
    alias: ["ls"],
    extensions: ["ls"],
    loadName: "liveScript"
  }),
  ofLegacy({
    name: "Lua",
    extensions: ["lua"],
  }),
  ofLegacy({
    name: "mIRC",
    extensions: ["mrc"],
  }),
  ofLegacy({
    name: "Mathematica",
    extensions: ["m","nb","wl","wls"],
  }),
  ofLegacy({
    name: "Modelica",
    extensions: ["mo"],
  }),
  ofLegacy({
    name: "MUMPS",
    extensions: ["mps"],
  }),
  ofLegacy({
    name: "Mbox",
    extensions: ["mbox"],
  }),
  ofLegacy({
    name: "Nginx",
    filename: /nginx.*\.conf$/i,
  }),
  ofLegacy({
    name: "NSIS",
    extensions: ["nsh","nsi"],
  }),
  ofLegacy({
    name: "NTriples",
    extensions: ["nt","nq"],
  }),
  ofLegacy({
    name: "Objective-C",
    alias: ["objective-c","objc"],
    extensions: ["m"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.objectiveC))
    }
  }),
  ofLegacy({
    name: "Objective-C++",
    alias: ["objective-c++","objc++"],
    extensions: ["mm"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.objectiveCpp))
    }
  }),
  ofLegacy({
    name: "OCaml",
    extensions: ["ml","mli","mll","mly"],
    load() {
      return import("@codemirror/legacy-modes/mode/mllike").then(m => legacy(m.oCaml))
    }
  }),
  ofLegacy({
    name: "Octave",
    extensions: ["m"],
  }),
  ofLegacy({
    name: "Oz",
    extensions: ["oz"],
  }),
  ofLegacy({
    name: "Pascal",
    extensions: ["p","pas"],
  }),
  ofLegacy({
    name: "Perl",
    extensions: ["pl","pm"],
  }),
  ofLegacy({
    name: "Pig",
    extensions: ["pig"],
  }),
  ofLegacy({
    name: "PowerShell",
    extensions: ["ps1","psd1","psm1"],
    loadName: "powerShell"
  }),
  ofLegacy({
    name: "Properties files",
    alias: ["ini","properties"],
    extensions: ["properties","ini","in"],
    loadName: "properties"
  }),
  ofLegacy({
    name: "ProtoBuf",
    extensions: ["proto"],
  }),
  ofLegacy({
    name: "Pug",
    alias: ["jade"],
    extensions: ["pug", "jade"],
  }),
  ofLegacy({
    name: "Puppet",
    extensions: ["pp"],
  }),
  ofLegacy({
    name: "Q",
    extensions: ["q"],
  }),
  ofLegacy({
    name: "R",
    alias: ["rscript"],
    extensions: ["r","R"],
  }),
  ofLegacy({
    name: "RPM Changes",
    load() {
      return import("@codemirror/legacy-modes/mode/rpm").then(m => legacy(m.rpmChanges))
    }
  }),
  ofLegacy({
    name: "RPM Spec",
    extensions: ["spec"],
    load() {
      return import("@codemirror/legacy-modes/mode/rpm").then(m => legacy(m.rpmSpec))
    }
  }),
  ofLegacy({
    name: "Ruby",
    alias: ["jruby","macruby","rake","rb","rbx"],
    extensions: ["rb"],
    filename: /^(Gemfile|Rakefile)$/,
  }),
  ofLegacy({
    name: "SAS",
    extensions: ["sas"],
  }),
  ofLegacy({
    name: "Scala",
    extensions: ["scala"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.scala))
    }
  }),
  ofLegacy({
    name: "Scheme",
    extensions: ["scm","ss"],
  }),
  ofLegacy({
    name: "Shell",
    alias: ["bash","sh","zsh"],
    extensions: ["sh","ksh","bash"],
    filename: /^PKGBUILD$/,
  }),
  ofLegacy({
    name: "Sieve",
    extensions: ["siv","sieve"],
  }),
  ofLegacy({
    name: "Smalltalk",
    extensions: ["st"],
  }),
  ofLegacy({
    name: "Solr",
  }),
  ofLegacy({
    name: "SML",
    extensions: ["sml","sig","fun","smackspec"],
    load() {
      return import("@codemirror/legacy-modes/mode/mllike").then(m => legacy(m.sml))
    }
  }),
  ofLegacy({
    name: "SPARQL",
    alias: ["sparul"],
    extensions: ["rq","sparql"],
  }),
  ofLegacy({
    name: "Spreadsheet",
    alias: ["excel","formula"],
  }),
  ofLegacy({
    name: "Squirrel",
    extensions: ["nut"],
    load() {
      return import("@codemirror/legacy-modes/mode/clike").then(m => legacy(m.squirrel))
    }
  }),
  ofLegacy({
    name: "Stylus",
    extensions: ["styl"],
  }),
  ofLegacy({
    name: "Swift",
    extensions: ["swift"],
  }),
  ofLegacy({
    name: "sTeX",
  }),
  ofLegacy({
    name: "LaTeX",
    alias: ["tex"],
    extensions: ["text","ltx","tex"],
    loadName: "stex"
  }),
  ofLegacy({
    name: "SystemVerilog",
    extensions: ["v","sv","svh"],
    loadName: "verilog"
  }),
  ofLegacy({
    name: "Tcl",
    extensions: ["tcl"],
  }),
  ofLegacy({
    name: "Textile",
    extensions: ["textile"],
  }),
  ofLegacy({
    name: "TiddlyWiki",
    loadName: "tiddlyWiki"
  }),
  ofLegacy({
    name: "Tiki wiki",
    loadName: "tiki"
  }),
  ofLegacy({
    name: "TOML",
    extensions: ["toml"],
  }),
  ofLegacy({
    name: "Troff",
    extensions: ["1","2","3","4","5","6","7","8","9"],
  }),
  ofLegacy({
    name: "TTCN",
    extensions: ["ttcn","ttcn3","ttcnpp"],
  }),
  ofLegacy({
    name: "TTCN_CFG",
    extensions: ["cfg"],
    load() {
      return import("@codemirror/legacy-modes/mode/ttcn-cfg").then(m => legacy(m.ttcnCfg))
    }
  }),
  ofLegacy({
    name: "Turtle",
    extensions: ["ttl"],
  }),
  ofLegacy({
    name: "Web IDL",
    extensions: ["webidl"],
    loadName: "webIDL"
  }),
  ofLegacy({
    name: "VB.NET",
    extensions: ["vb"],
    loadName: "vb"
  }),
  ofLegacy({
    name: "VBScript",
    extensions: ["vbs"],
    loadName: "vbScript"
  }),
  ofLegacy({
    name: "Velocity",
    extensions: ["vtl"],
  }),
  ofLegacy({
    name: "Verilog",
    extensions: ["v"],
  }),
  ofLegacy({
    name: "VHDL",
    extensions: ["vhd","vhdl"],
  }),
  ofLegacy({
    name: "XQuery",
    extensions: ["xy","xquery"],
    loadName: "xQuery"
  }),
  ofLegacy({
    name: "Yacas",
    extensions: ["ys"],
  }),
  ofLegacy({
    name: "Z80",
    extensions: ["z80"],
  }),
  ofLegacy({
    name: "MscGen",
    extensions: ["mscgen","mscin","msc"],
  }),
  ofLegacy({
    name: "Xù",
    extensions: ["xu"],
    load() {
      return import("@codemirror/legacy-modes/mode/mscgen").then(m => legacy(m.xu))
    }
  }),
  ofLegacy({
    name: "MsGenny",
    extensions: ["msgenny"],
    load() {
      return import("@codemirror/legacy-modes/mode/mscgen").then(m => legacy(m.msgenny))
    }
  }),
  of({
    name: "Vue",
    extensions: ["vue"],
  }),
  of({
    name: "Angular Template",
    module: "@codemirror/lang-angular",
    loadName: "angular"
  })
]
