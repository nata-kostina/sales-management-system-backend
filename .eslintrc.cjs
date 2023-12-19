module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["import", "import-newlines", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "airbnb",
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
    ],

    // "overrides": [
    // 	{
    // 		"env": {
    // 			"node": true
    // 		},
    // 		"files": [
    // 			".eslintrc.{js,cjs}"
    // 		],
    // 		"parserOptions": {
    // 			"sourceType": "script",
    //             "ecmaVersion": "latest",
    //             // "sourceType": "module",
    //             project: ["./tsconfig.json"],
    // 		}
    // 	}
    // ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
    },

    ignorePatterns: [".eslintrc.cjs"],
    rules: {
        semi: ["error", "always"],
        reportUnusedDisableDirectives: "off",
        "linebreak-style": ["error", "windows"],
        "arrow-body-style": "off",
        "arrow-parens": "off",
        "class-methods-use-this": "off",
        "consistent-return": "off",
        curly: ["error", "all"],
        "default-case": "off",
        "function-paren-newline": "off",
        "global-require": "warn",
        "implicit-arrow-linebreak": "off",
        "max-classes-per-file": "off",
        "max-len": [
            "error",
            {
                code: 140,
                comments: 0,
                ignorePattern: '^import |/.+eslint-.+able|//|"[^"]{100,}"',
            },
        ],
        "newline-per-chained-call": "off",
        "no-await-in-loop": "off",
        "no-case-declarations": "off",
        "no-confusing-arrow": "off",
        "no-console": "off",
        "no-continue": "off",
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-inner-declarations": "off", // not actual since we target only ES6
        "no-irregular-whitespace": [
            "error",
            {
                // stricter than airbnb has
                skipStrings: false,
                skipComments: false,
                skipRegExps: false,
                skipTemplates: false,
            },
        ],
        "no-mixed-operators": [
            "error",
            {
                groups: [
                    ["??", "==", "!=", "===", "!=="], // block `a ?? b === c` and similar
                ],
            },
        ],
        "no-nested-ternary": "off",
        "no-param-reassign": ["warn", { props: false }],
        "no-plusplus": "off",
        "no-prototype-builtins": "warn",
        "no-restricted-globals": "off",
        "no-restricted-properties": [
            "error",
            {
                object: "arguments",
                property: "callee",
                message: "arguments.callee is deprecated",
            },
        ],
        "no-restricted-syntax": [
            "error",
            {
                selector: "LabeledStatement",
                message:
                    "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
            },
            {
                selector: "WithStatement",
                message:
                    "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
            },
        ],
        "no-underscore-dangle": "off",
        "no-useless-escape": "warn", // there are places where escape make sense even if not strictly required. For example `/[[\]]/` vs `/[\[\]]/`
        "object-curly-newline": [
            "error",
            {
                ObjectExpression: { multiline: true, consistent: true },
                ObjectPattern: { multiline: true, consistent: true },
                ImportDeclaration: { multiline: true, consistent: true },
                ExportDeclaration: { multiline: true, consistent: true },
            },
        ],
        "object-shorthand": "off", // NOTE: we have our own rule - evo/object-shorthand
        "operator-linebreak": "off",
        "prefer-arrow-callback": [
            "error",
            {
                allowNamedFunctions: true,
                allowUnboundThis: true,
            },
        ],
        "prefer-destructuring": "off",
        "prefer-exponentiation-operator": "warn",
        "prefer-promise-reject-errors": ["warn", { allowEmptyReject: true }],
        "prefer-spread": "off",
        "prefer-template": "warn",
        "quote-props": ["warn", "consistent-as-needed"],
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/await-thenable": "warn",
        "@typescript-eslint/ban-ts-comment": [
            "warn",
            {
                "ts-expect-error": "allow-with-description",
                "ts-ignore": "allow-with-description",
                "ts-nocheck": "allow-with-description",
                "ts-check": false,
                minimumDescriptionLength: 3,
            },
        ],
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/consistent-indexed-object-style": [
            "warn",
            "record",
        ],
        "@typescript-eslint/consistent-type-exports": [
            "warn",
            { fixMixedExportsWithInlineTypeSpecifier: true },
        ],
        "@typescript-eslint/dot-notation": ["warn", { allowKeywords: true }],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            { accessibility: "explicit" },
        ],
        "@typescript-eslint/explicit-module-boundary-types": [
            "error",
            {
                allowArgumentsExplicitlyTypedAsAny: false,
                allowDirectConstAssertionInArrowFunctions: true,
                allowHigherOrderFunctions: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                MemberExpression: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: {
                    arguments: 1,
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoredNodes: [
                    // airbnb list
                    "JSXElement",
                    "JSXElement > *",
                    "JSXAttribute",
                    "JSXIdentifier",
                    "JSXNamespacedName",
                    "JSXMemberExpression",
                    "JSXSpreadAttribute",
                    "JSXExpressionContainer",
                    "JSXOpeningElement",
                    "JSXClosingElement",
                    "JSXFragment",
                    "JSXOpeningFragment",
                    "JSXClosingFragment",
                    "JSXText",
                    "JSXEmptyExpression",
                    "JSXSpreadChild",
                    "TemplateLiteral ConditionalExpression",
                    "TemplateLiteral CallExpression",
                    "TemplateLiteral TemplateElement",
                    "TSTypeParameterInstantiation",
                    "ExpressionStatement CallExpression ArrowFunctionExpression",
                    "TSPropertySignature TSTypeAnnotation",
                    "Identifier TSTypeAnnotation",
                    "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
                ],
                ignoreComments: false,
            },
        ],
        "@typescript-eslint/quotes": [
            "error",
            "double",
            { allowTemplateLiterals: true, avoidEscape: true },
        ],
        "@typescript-eslint/lines-between-class-members": [
            "warn",
            "always",
            { exceptAfterSingleLine: true },
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                multiline: {
                    requireLast: true,
                    delimiter: "semi",
                },
                singleline: {
                    requireLast: true,
                    delimiter: "semi",
                },
            },
        ],
        "@typescript-eslint/member-ordering": ["error"],
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-explicit-any": ["error"],
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-floating-promises": [
            "warn",
            {
                ignoreVoid: false,
                ignoreIIFE: false,
            },
        ],
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-loop-func": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-misused-promises": [
            "off",
            {
                checksConditionals: true,
                checksVoidReturn: true,
            },
        ],
        "@typescript-eslint/no-namespace": ["error"],
        "@typescript-eslint/no-shadow": [
            "warn",
            {
                ignoreTypeValueShadow: false,
                ignoreFunctionTypeParameterNameValueShadow: true,
            },
        ],
        "@typescript-eslint/no-this-alias": ["error"],
        "@typescript-eslint/unbound-method": [
            "off",
            {
                ignoreStatic: false,
            },
        ],
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/no-unused-expressions": [
            "error",
            {
                allowShortCircuit: false,
                allowTernary: true,
                allowTaggedTemplates: false,
                enforceForJSX: true,
            },
        ],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/prefer-for-of": ["error"],
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/triple-slash-reference": [
            "error",
            { path: "never", types: "never", lib: "never" },
        ],
        "@typescript-eslint/type-annotation-spacing": ["error"],
        "@typescript-eslint/require-await": "warn",
        "import/no-default-export": "error",
        "import/no-dynamic-require": "warn",
        "import/no-extraneous-dependencies": "off",
        "import/no-unassigned-import": ["error"],
        "import/no-webpack-loader-syntax": "off",
        "import/prefer-default-export": "off",
        "import/no-unassigned-import": "off",
        "import-newlines/enforce": [
            "warn",
            {
                items: Infinity,
                "max-len": 120,
                semi: true,
                forceSingleLine: false,
            },
        ],
    },
};
