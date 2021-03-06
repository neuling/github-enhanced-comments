import $ from 'npm-zepto';
import changeCase from 'change-case';

const issueTextareas = () => {
  return $('textarea[name="comment[body]"], textarea[name="issue[body]"]');
};

const utilityFunctions = {
  lower_case: (string) => {
    return changeCase.lowerCase(string);
  },
  upper_case: (string) => {
    return changeCase.upperCase(string);
  },
  camel_case: (string) => {
    return changeCase.camelCase(string);
  },
  pascal_case: (string) => {
    return changeCase.pascalCase(string);
  },
  snake_case: (string) => {
    return changeCase.snakeCase(string);
  },
  param_case: (string) => {
    return changeCase.paramCase(string);
  },
};

const replacements = {
  repo_name: () => {
    return $('.repohead-details-container h1 *[itemprop=name]').text();
  },
  repo_url: () => {
    return document.location.origin + $('.repohead-details-container h1 *[itemprop=name] a').attr('href');
  },
  owner_url: () => {
    return document.location.origin + $('.repohead-details-container h1 span[itemprop=author] a').attr('href');
  },
  owner: () => {
    const ownerName = $('.repohead-details-container h1 span[itemprop=author]').text();
    return `@${ownerName}`;
  },
  author: () => {
    const authorName = $('#show_issue .gh-header-meta a.author').text();
    return `@${authorName}`;
  }
};

const availableUtilityFunctions = Object.keys(utilityFunctions);

const replace = () => {
  issueTextareas().forEach((textarea) => {
    $(textarea).val().replace(/\{([^\}]+)\}/g, (found) => {
      const withoutBrakets = found.replace('{', '').replace('}', '').toLowerCase();

      const utilityFunctionMatcher = new RegExp(`^(${availableUtilityFunctions.join('|')})`);
      const utilityFunctionMatch = withoutBrakets.match(utilityFunctionMatcher)
      const utilityFunction = utilityFunctionMatch && utilityFunctionMatch[0];

      const replacement = replacements[withoutBrakets.replace(`${utilityFunction}_`, '')];

      if (replacement) {
        let replaced = replacement();

        if (utilityFunction) {
          replaced = utilityFunctions[utilityFunction](replaced);
        }

        $(textarea).val($(textarea).val().replace(found, replaced));
      }
    });
  })
};

setInterval(replace, 100);
