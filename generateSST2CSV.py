import xarray as xr
import pandas as pd

# Load data
ds = xr.open_dataset("sst.mnmean.nc")

# Kig på variable for at forstå datastrukturen
print(ds)

# Prøv først uden filter — hvad er shape, min/max?
print(ds['sst'])

# Nordatlanten
sst_nordatlanten = ds['sst'].sel(lat=slice(60, 0), lon=slice(-80, 0))
print("Subset (Nordatlanten):", sst_nordatlanten)

# Drop NaNs og gem nogle prøvedata
sst_df = sst_nordatlanten.mean(dim=["lat", "lon"], skipna=True).to_dataframe().dropna()

# Hent år og grupér
sst_df["year"] = sst_df.index.year
sst_annual = sst_df.groupby("year").mean().reset_index()

# Tilføj fiktivt år
sst_2035 = pd.DataFrame({
    "year": [2035],
    "sst": [sst_annual["sst"].mean() + 0.5]
})
sst_annual = pd.concat([sst_annual, sst_2035], ignore_index=True)

# Gem årlige data
sst_annual.to_csv("sst_nordatlanten.csv", index=False)
print("✅ Gemte sst_nordatlanten.csv med:", len(sst_annual), "rækker")

# Beregn statistik for hvert årti
sst_df["decade"] = (sst_df["year"] // 10) * 10
sst_decades = sst_df.groupby("decade").agg({
    "sst": ["mean", "std", "min", "max"]
}).reset_index()

# Flatten kolonnenavne
sst_decades.columns = ["decade", "mean_sst", "std_sst", "min_sst", "max_sst"]

# Gem årti-data
sst_decades.to_csv("sst_decades.csv", index=False)
print("✅ Gemte sst_decades.csv med:", len(sst_decades), "årtier")