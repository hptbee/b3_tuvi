# B3 in this product repository

Cursor discovers **commands**, **agents**, and **rules** from this repo’s `.cursor/` tree. **Skills are not copied here** (duplicate discovery). Use one of:

1. **User-level skills** (recommended, once per machine): junction/symlink  
   `%USERPROFILE%\.cursor\skills\b3-ai-engineering` → `{B3_HOME}\.cursor\skills`
2. **`B3_HOME`**: read `.b3/home` or set env `B3_HOME` to your `b3_ai-engineering` clone. `/autodev` and agents load procedures from there.

Re-run attach after upgrading B3:

```powershell
.\adapters\install-product.ps1 -ProductRoot D:\path\to\this-repo -HostName cursor
```

Commit `.b3/home` and `.cursor/commands/`. Keep `.b3/autodev/` local (gitignored).
