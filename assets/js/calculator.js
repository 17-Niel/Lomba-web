  document.addEventListener('DOMContentLoaded', function() {
    const calculateBmiBtn = document.getElementById('calculate-bmi');
    const calculateCaloriesBtn = document.getElementById('calculate-calories');
    const bmiResult = document.getElementById('bmi-result');
    const caloriesResult = document.getElementById('calories-result');

    // BMI Calculator
    calculateBmiBtn.addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        // Validasi input
        if (!weight || !height) {
            alert('Silakan masukkan berat dan tinggi badan yang valid.');
            return;
        }

        if (weight < 20 || weight > 200) {
            alert('Berat badan harus antara 20-200 kg.');
            return;
        }

        if (height < 100 || height > 250) {
            alert('Tinggi badan harus antara 100-250 cm.');
            return;
        }

        // Hitung BMI
        const heightInMeter = height / 100;
        const bmi = weight / (heightInMeter * heightInMeter);
        const roundedBmi = bmi.toFixed(1);

        // Tentukan kategori BMI
        let category = '';
        let description = '';
        let progressWidth = 0;
        let progressColor = '';

        if (bmi < 18.5) {
            category = 'KURUS';
            description = 'Berat badan Anda kurang. Disarankan untuk menambah asupan makanan bergizi dan berkonsultasi dengan ahli gizi.';
            progressWidth = (bmi / 18.5) * 25;
            progressColor = 'bg-warning';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'NORMAL';
            description = 'Selamat! Berat badan Anda ideal. Pertahankan pola makan sehat dan olahraga teratur.';
            progressWidth = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 50;
            progressColor = 'bg-success';
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'GEMUK';
            description = 'Anda memiliki berat badan berlebih. Disarankan untuk menurunkan berat badan melalui diet sehat dan olahraga.';
            progressWidth = 75 + ((bmi - 25) / (29.9 - 25)) * 15;
            progressColor = 'bg-warning';
        } else {
            category = 'OBESITAS';
            description = 'Anda mengalami obesitas. Sangat disarankan untuk berkonsultasi dengan dokter dan melakukan program penurunan berat badan.';
            progressWidth = 90 + ((bmi - 30) / 20) * 10;
            progressColor = 'bg-danger';
        }

        // Tampilkan hasil
        document.getElementById('bmi-value').textContent = roundedBmi;
        document.getElementById('bmi-category').textContent = category;
        document.getElementById('bmi-description').textContent = description;
        
        const bmiProgress = document.getElementById('bmi-progress');
        bmiProgress.style.width = Math.min(progressWidth, 100) + '%';
        bmiProgress.className = 'progress-bar ' + progressColor;
        
        bmiResult.style.display = 'block';
        bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Calorie Calculator
    calculateCaloriesBtn.addEventListener('click', function() {
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight-calorie').value);
        const height = parseFloat(document.getElementById('height-calorie').value);
        const activity = parseFloat(document.getElementById('activity').value);

        // Validasi input
        if (!age || !weight || !height) {
            alert('Silakan lengkapi semua data yang diperlukan.');
            return;
        }

        if (age < 12 || age > 100) {
            alert('Usia harus antara 12-100 tahun.');
            return;
        }

        if (weight < 20 || weight > 200) {
            alert('Berat badan harus antara 20-200 kg.');
            return;
        }

        if (height < 100 || height > 250) {
            alert('Tinggi badan harus antara 100-250 cm.');
            return;
        }

        // Hitung BMR (Basal Metabolic Rate)
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Hitung TDEE (Total Daily Energy Expenditure)
        const maintenanceCalories = Math.round(bmr * activity);
        const weightLossCalories = Math.round(maintenanceCalories * 0.85);
        const weightGainCalories = Math.round(maintenanceCalories * 1.15);

        // Tampilkan hasil
        document.getElementById('calories-value').textContent = maintenanceCalories.toLocaleString() + ' kalori/hari';
        document.getElementById('weight-loss-calories').textContent = weightLossCalories.toLocaleString();
        document.getElementById('maintenance-calories').textContent = maintenanceCalories.toLocaleString();
        document.getElementById('weight-gain-calories').textContent = weightGainCalories.toLocaleString();
        
        caloriesResult.style.display = 'block';
        caloriesResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Auto-fill weight and height from BMI to Calorie calculator
    document.getElementById('weight').addEventListener('input', function() {
        document.getElementById('weight-calorie').value = this.value;
    });

    document.getElementById('height').addEventListener('input', function() {
        document.getElementById('height-calorie').value = this.value;
    });

    // Reset results when inputs change
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            bmiResult.style.display = 'none';
            caloriesResult.style.display = 'none';
        });
    });
});