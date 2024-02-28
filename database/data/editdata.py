import pandas as pd

# Load the TSV file into a DataFrame
file_path = 'truncated_title.basics.tsv'
df = pd.read_csv(file_path, sep='\t')

# Split the genres string into a list of genres
df['genres'] = df['genres'].apply(lambda x: x.split(',') if isinstance(x, str) else [])

# Save the modified DataFrame back to the TSV file
df.to_csv(file_path, sep='\t', index=False)
