import os
import re
import glob

# Paths
SRC_DIR = r"c:\numan\Numanx-projacts\numanx-tools-hub\src"

# Regular expressions for imports
import_re = re.compile(r"import\s+(\w+)\s+from\s+['\"]([^'\"]+)['\"]")
layout_tag_re = re.compile(r"<([A-Z]\w+)")

# Regexp for IDs and Classes in HTML markup
id_decl_re = re.compile(r'\bid\s*=\s*[\'"]([^\'\"]+)[\'"]')
class_decl_re = re.compile(r'\bclass\s*=\s*[\'"]([^\'\"]+)[\'"]')
class_name_decl_re = re.compile(r'\bclassName\s*=\s*[\'"]([^\'\"]+)[\'"]')

# Regexp for DOM queries
get_id_re = re.compile(r"\bdocument\.getElementById\(\s*['\"]([^'\"]+)['\"]\s*\)")
query_re = re.compile(r"\b(?:document|[\w$]+)\.querySelector\(\s*['\"]([^'\"]+)['\"]\s*\)")
query_all_re = re.compile(r"\b(?:document|[\w$]+)\.querySelectorAll\(\s*['\"]([^'\"]+)['\"]\s*\)")
get_classes_re = re.compile(r"\b(?:document|[\w$]+)\.getElementsByClassName\(\s*['\"]([^'\"]+)['\"]\s*\)")

def resolve_path(current_file, import_path):
    # Astro aliases or relative paths
    if import_path.startswith('@/'):
        return os.path.normpath(os.path.join(SRC_DIR, import_path[2:]))
    if import_path.startswith('~/'):
        return os.path.normpath(os.path.join(SRC_DIR, import_path[2:]))
    if import_path.startswith('.'):
        dir_name = os.path.dirname(current_file)
        res = os.path.normpath(os.path.join(dir_name, import_path))
        # try adding extensions if not present
        for ext in ['', '.astro', '.ts', '.js']:
            if os.path.exists(res + ext):
                return res + ext
        return res
    # Could be npm package
    return None

def parse_astro_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Split into frontmatter and template/scripts
    parts = content.split('---')
    frontmatter = ""
    template = ""
    if len(parts) >= 3:
        frontmatter = parts[1]
        template = '---'.join(parts[2:])
    else:
        template = content

    # Find imports in frontmatter
    imports = {}
    for match in import_re.finditer(frontmatter):
        name, path = match.groups()
        resolved = resolve_path(filepath, path)
        if resolved:
            imports[name] = resolved

    # Separate template into HTML markup and script tags
    # Let's extract script tags content
    script_blocks = []
    # Find all content between <script> and </script>
    script_re = re.compile(r"<script\b[^>]*>(.*?)</script>", re.DOTALL)
    
    markup_content = template
    for match in script_re.finditer(template):
        script_blocks.append(match.group(1))
        # Replace script content with spaces to avoid finding IDs/classes in scripts as markup declarations
        markup_content = markup_content.replace(match.group(0), " " * len(match.group(0)))

    # Extract declared IDs and classes in markup
    declared_ids = set()
    declared_classes = set()
    for match in id_decl_re.finditer(markup_content):
        # Handle simple dynamic IDs if any, but clean them
        val = match.group(1)
        if not val.startswith('{') and not val.endswith('}'):
            declared_ids.add(val)
            
    for match in class_decl_re.finditer(markup_content):
        val = match.group(1)
        # Split classes
        for cls in val.split():
            if not cls.startswith('{') and not cls.endswith('}'):
                declared_classes.add(cls)

    for match in class_name_decl_re.finditer(markup_content):
        val = match.group(1)
        for cls in val.split():
            declared_classes.add(cls)

    # Check which Layouts or Components are used in template
    used_components = set()
    for match in layout_tag_re.finditer(markup_content):
        comp = match.group(1)
        if comp in imports:
            used_components.add(imports[comp])

    # Parse script queries
    queries = []
    
    # We also check client side script lines in the script blocks
    # We want line numbers relative to the entire file
    # Let's find matches in the whole file and check if they fall in script blocks, or we search per line
    lines = content.splitlines()
    in_script = False
    script_tag_count = 0
    for idx, line in enumerate(lines, 1):
        # Detect script tag open/close
        if '<script' in line:
            in_script = True
            continue
        if '</script>' in line:
            in_script = False
            continue
            
        if in_script or filepath.endswith(('.js', '.ts')):
            # document.getElementById
            for match in get_id_re.finditer(line):
                queries.append({
                    'line': idx,
                    'type': 'getElementById',
                    'selector': match.group(1),
                    'raw': match.group(0)
                })
            # querySelector
            for match in query_re.finditer(line):
                queries.append({
                    'line': idx,
                    'type': 'querySelector',
                    'selector': match.group(1),
                    'raw': match.group(0)
                })
            # querySelectorAll
            for match in query_all_re.finditer(line):
                queries.append({
                    'line': idx,
                    'type': 'querySelectorAll',
                    'selector': match.group(1),
                    'raw': match.group(0)
                })
            # getElementsByClassName
            for match in get_classes_re.finditer(line):
                queries.append({
                    'line': idx,
                    'type': 'getElementsByClassName',
                    'selector': match.group(1),
                    'raw': match.group(0)
                })

    return {
        'filepath': filepath,
        'declared_ids': declared_ids,
        'declared_classes': declared_classes,
        'used_components': list(used_components),
        'queries': queries
    }

def main():
    print("Scanning src directory...")
    astro_files = glob.glob(os.path.join(SRC_DIR, "**/*.astro"), recursive=True)
    ts_files = glob.glob(os.path.join(SRC_DIR, "**/*.ts"), recursive=True)
    js_files = glob.glob(os.path.join(SRC_DIR, "**/*.js"), recursive=True)

    files = astro_files + ts_files + js_files
    
    db = {}
    for f in files:
        # Skip node_modules or output folders just in case
        if "node_modules" in f or "dist" in f or ".astro" in f:
            continue
        db[f] = parse_astro_file(f)

    # Let's verify queries for each file
    print(f"Total files parsed: {len(db)}")
    
    # We will build global catalogs
    global_ids = set()
    global_classes = set()
    for f, data in db.items():
        global_ids.update(data['declared_ids'])
        global_classes.update(data['declared_classes'])

    print(f"Global unique IDs defined: {len(global_ids)}")
    print(f"Global unique Classes defined: {len(global_classes)}")

    # Tracing helper: get all available elements for a file (including transitively imported components/layouts)
    memo_available = {}
    
    def get_available_elements(filepath, visited=None):
        if visited is None:
            visited = set()
        if filepath in memo_available:
            return memo_available[filepath]
        if filepath in visited:
            return {'ids': set(), 'classes': set()}
            
        visited.add(filepath)
        data = db.get(filepath)
        if not data:
            return {'ids': set(), 'classes': set()}
            
        res_ids = set(data['declared_ids'])
        res_classes = set(data['declared_classes'])
        
        for comp_path in data['used_components']:
            sub = get_available_elements(comp_path, visited)
            res_ids.update(sub['ids'])
            res_classes.update(sub['classes'])
            
        memo_available[filepath] = {'ids': res_ids, 'classes': res_classes}
        return memo_available[filepath]

    # Standard global elements that are known to exist in the global wrapper layout (MainLayout.astro, etc.)
    # Let's find and add them to available elements for all pages
    # Or we can let the dependency resolver handle it since pages import layouts.
    
    issues = []
    operational = []

    for filepath, data in db.items():
        if not data['queries']:
            operational.append(filepath)
            continue
            
        # Get active elements for this file
        active = get_available_elements(filepath)
        
        file_issues = []
        for q in data['queries']:
            selector = q['selector']
            q_type = q['type']
            
            # Parse selector to extract target ID/Class
            # e.g. '#my-id' -> ID: my-id
            # '.my-class' -> Class: my-class
            # 'div > .my-class' -> Class: my-class
            # '[id="my-id"]' -> ID: my-id
            targets = [] # list of (type, value) e.g. [('id', 'my-id')]
            
            # Simple parsing
            # Extract IDs
            for match in re.finditer(r"#([\w-]+)", selector):
                targets.append(('id', match.group(1)))
            # Extract Classes
            for match in re.finditer(r"\.([\w-]+)", selector):
                targets.append(('class', match.group(1)))
            
            # If getElementById or getElementsByClassName, it's a direct ID/Class name
            if q_type == 'getElementById':
                # Sometimes it can be dynamic, check if it contains template strings or concatenation
                if selector and not any(c in selector for c in ['+', '$', '{', '}']):
                    targets.append(('id', selector))
            elif q_type == 'getElementsByClassName':
                if selector and not any(c in selector for c in ['+', '$', '{', '}']):
                    for cls in selector.split():
                        targets.append(('class', cls))
            elif q_type in ('querySelector', 'querySelectorAll'):
                # If it's a simple selector without # or . but it's just an element tag name, or dynamic
                # If there are no # or . but it is not dynamic, it could be a tag name like 'input', 'button', etc.
                # In that case, we don't flag unless it's an ID or Class query
                pass
                
            # Check targets
            for t_type, t_val in targets:
                # If it's a dynamic template, skip auditing
                if any(c in t_val for c in ['$', '{', '}']):
                    continue
                    
                if t_type == 'id':
                    if t_val not in active['ids']:
                        # Double check if it exists globally anywhere in the project
                        in_global = t_val in global_ids
                        file_issues.append({
                            'line': q['line'],
                            'raw': q['raw'],
                            'selector': selector,
                            'missing_type': 'ID',
                            'missing_val': t_val,
                            'in_global': in_global
                        })
                elif t_type == 'class':
                    if t_val not in active['classes']:
                        in_global = t_val in global_classes
                        # Tailwind classes are often queried but not declared explicitly in HTML (they come from CSS or are styling)
                        # However, if it's a JS target class, it might be unique.
                        # Let's only flag class issues if they are not in global classes and look like JS hooks (e.g. starting with js- or unique names)
                        # Wait, let's flag them anyway and we can filter.
                        file_issues.append({
                            'line': q['line'],
                            'raw': q['raw'],
                            'selector': selector,
                            'missing_type': 'Class',
                            'missing_val': t_val,
                            'in_global': in_global
                        })

        if file_issues:
            issues.append({
                'filepath': filepath,
                'issues': file_issues
            })
        else:
            operational.append(filepath)

    print(f"\n--- AUDIT RESULTS ---")
    print(f"Verified Operational (No query-markup mismatch): {len(operational)}")
    print(f"Files with potential issues: {len(issues)}")
    
    for f_issue in issues:
        print(f"\nFile: {f_issue['filepath']}")
        for iss in f_issue['issues']:
            glob_status = "Exists elsewhere in project" if iss['in_global'] else "Does NOT exist anywhere in project"
            print(f"  Line {iss['line']}: {iss['raw']} -> Missing {iss['missing_type']} '{iss['missing_val']}' ({glob_status})")

if __name__ == "__main__":
    main()
