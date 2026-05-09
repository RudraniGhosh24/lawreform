# Indian Legal Rights RAG Dataset

**Built by Rudrani Ghosh · [lawreformer.com](https://lawreformer.com)**

## Description

A curated dataset of 203 chunked Indian legal provisions designed for Retrieval-Augmented Generation (RAG) in legal rights assistants. Each entry contains the source law, section reference, plain-language summary, and keywords for retrieval.

## Coverage

20 Indian laws covering rights of underserved communities:

1. West Bengal Premises Tenancy Act, 1997 (10 provisions)
2. Delhi Rent Control Act, 1958 (10 provisions)
3. Maharashtra Rent Control Act, 1999 (10 provisions)
4. Code on Wages, 2019 (12 provisions)
5. Right to Information Act, 2005 (11 provisions)
6. MGNREGA, 2005 (10 provisions)
7. Protection of Women from Domestic Violence Act, 2005 (11 provisions)
8. Consumer Protection Act, 2019 (12 provisions)
9. Legal Services Authorities Act, 1987 (10 provisions)
10. Code on Social Security, 2020 (10 provisions)
11. Industrial Relations Code, 2020 (10 provisions)
12. Occupational Safety, Health and Working Conditions Code, 2020 (10 provisions)
13. Sexual Harassment of Women at Workplace Act, 2013 (10 provisions)
14. Bonded Labour System (Abolition) Act, 1976 (8 provisions)
15. Child Labour (Prohibition and Regulation) Amendment Act, 2016 (8 provisions)
16. SC/ST (Prevention of Atrocities) Act, 1989 (10 provisions)
17. Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (9 provisions)
18. Motor Vehicles (Amendment) Act, 2019 (10 provisions)
19. Indian Penal Code / Bharatiya Nyaya Sanhita (10 provisions)
20. Hindu Marriage Act / Special Marriage Act (12 provisions)

## Schema

```json
{
  "id": "unique-identifier",
  "source": "Full Law Name, Year",
  "section": "Section X — Title",
  "text": "Plain language summary of the legal provision (2-4 sentences)",
  "keywords": ["keyword1", "keyword2", "hindi_transliteration"]
}
```

## Usage

This dataset is used by [LawReformer AI](https://ai.lawreformer.com) for RAG-based legal rights assistance. When a user asks a question, the system retrieves the most relevant chunks using keyword matching and passes them as grounded context to Gemma 4.

## Source

All provisions are sourced from public domain Indian government publications:
- legislative.gov.in
- india.gov.in
- indiacode.nic.in

## License

Public Domain — Indian government legal texts are not copyrightable.

## Citation

If you use this dataset, please cite:
```
Rudrani Ghosh. Indian Legal Rights RAG Dataset. 2026.
https://github.com/RudraniGhosh24/lawreform
```
