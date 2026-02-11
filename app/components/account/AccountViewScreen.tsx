// ===== app/components/account/AccountViewScreen.tsx =====
import { useState, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  InputAdornment,
  Collapse,
} from '@mui/material';
import {
  Search,
  AccountBalance,
  Person,
  CreditCard,
  Phone,
  CalendarToday,
  AttachMoney,
  KeyboardReturn,
  ExitToApp,
  Visibility,
  VisibilityOff,
  Info,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Security,
  ContactPhone,
  Home,
  Badge,
  CreditScore,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import type { AccountViewRequest, AccountViewResponse } from '~/types/account';

interface AccountViewScreenProps {
  onSearch: (request: AccountViewRequest) => void;
  onExit?: () => void;
  data?: AccountViewResponse | null;
  loading?: boolean;
  error?: string | null;
}

export function AccountViewScreen({
  onSearch,
  onExit,
  data,
  loading = false,
  error,
}: AccountViewScreenProps) {
  const theme = useTheme();
  const [accountId, setAccountId] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const testAccounts = [
    { id: '11111111111', desc: 'Active - John Smith - Premium', status: 'Active' },
    { id: '22222222222', desc: 'Inactive - Jane Doe - Standard', status: 'Inactive' },
    { id: '33333333333', desc: 'High Balance - Robert Johnson - Platinum', status: 'Active' },
    { id: '44444444444', desc: 'New Account - Maria Garcia - Basic', status: 'Active' },
  ];

  const handleAccountIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setAccountId(value);
      setFieldError(null);
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    if (!accountId.trim()) {
      setFieldError('No se proporcionó el número de cuenta');
      return;
    }

    if (accountId.length !== 11 || accountId === '00000000000') {
      setFieldError('El número de cuenta debe tener 11 dígitos y no puede ser todo ceros');
      return;
    }
    
    onSearch({ accountId });
  }, [accountId, onSearch]);

  const handleTestAccountSelect = useCallback((testAccountId: string) => {
    setAccountId(testAccountId);
    setFieldError(null);
    onSearch({ accountId: testAccountId });
    setShowTestAccounts(false);
  }, [onSearch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit?.();
    }
  }, [onExit]);

  const formatCurrency = useCallback((amount?: number) => {
    if (amount === undefined || amount === null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }, []);

  const formatSSN = useCallback((ssn?: string) => {
    if (!ssn) return '';
    if (showSensitiveData) {
      return ssn;
    }
    return `***-**-${ssn.slice(-4)}`;
  }, [showSensitiveData]);

  const formatCardNumber = useCallback((cardNumber?: string) => {
    if (!cardNumber) return '';
    if (showSensitiveData) {
      return cardNumber;
    }
    const lastFour = cardNumber.replace(/\D/g, '').slice(-4);
    return `****-****-****-${lastFour}`;
  }, [showSensitiveData]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Y': return 'success';
      case 'N': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'Y': return 'Activo';
      case 'N': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const getBalanceColor = (balance?: number) => {
    if (!balance) return 'text.primary';
    return balance > 0 ? 'error.main' : 'success.main';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CAVW"
          programName="COACTVWC"
          title="CardDemo - Visor de cuentas"
          subtitle="Ver detalles de cuenta"
        />

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ver cuenta
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 3,
              }}
            >
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight={600}
              >
                Número de cuenta:
              </Typography>
              
              <TextField
                value={accountId}
                onChange={handleAccountIdChange}
                placeholder="11111111111"
                size="medium"
                disabled={loading}
                error={!!fieldError}
                helperText={fieldError}
                inputProps={{
                  maxLength: 11,
                  style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </Box>

            {import.meta.env.DEV && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Info />}
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                  sx={{ borderRadius: 2 }}
                >
                  {showTestAccounts ? 'Ocultar cuentas de prueba' : 'Mostrar cuentas de prueba'}
                </Button>
              </Box>
            )}

            <Collapse in={showTestAccounts}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  borderColor: theme.palette.info.main,
                }}
              >
                <Typography variant="subtitle2" gutterBottom color="info.main" fontWeight={600}>
                  Cuentas de prueba (solo en desarrollo)
                </Typography>
                <Grid container spacing={1}>
                  {testAccounts.map((account) => (
                    <Grid item xs={12} sm={6} key={account.id}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleTestAccountSelect(account.id)}
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          width: '100%',
                          p: 1,
                          borderRadius: 1,
                          textTransform: 'none',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {account.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {account.desc}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Collapse>

            {data && data.inputValid && !data.errorMessage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
                <Chip
                  label={getStatusLabel(data.accountStatus)}
                  color={getStatusColor(data.accountStatus) as any}
                  variant="filled"
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                  icon={data.accountStatus === 'Y' ? <TrendingUp /> : <TrendingDown />}
                />
                {data.groupId && (
                  <Chip
                    label={`Miembro del grupo ${data.groupId}`}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {data?.errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {data.errorMessage}
              </Alert>
            )}

            {data?.infoMessage && !data?.errorMessage && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                {data.infoMessage}
              </Alert>
            )}

            {data && data.inputValid && !data.errorMessage && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={showSensitiveData ? <VisibilityOff /> : <Visibility />}
                    onClick={() => setShowSensitiveData(!showSensitiveData)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showSensitiveData ? 'Ocultar datos sensibles' : 'Mostrar datos sensibles'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={4}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Información de la cuenta
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                              Apertura:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(data.openDate)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                              Vencimiento:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(data.expirationDate)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                              Reemisión:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(data.reissueDate)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Badge sx={{ fontSize: 16, mr: 0.5 }} />
                              Grupo de cuenta:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.groupId || 'N/A'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CreditCard sx={{ fontSize: 16, mr: 0.5 }} />
                              Número de tarjeta:
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                              {formatCardNumber(data.cardNumber)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Información financiera
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AccountBalanceWallet sx={{ fontSize: 16, mr: 0.5 }} />
                              Límite de crédito:
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="success.main">
                              {formatCurrency(data.creditLimit)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AccountBalanceWallet sx={{ fontSize: 16, mr: 0.5 }} />
                              Límite de crédito en efectivo:
                            </Typography>
                            <Typography variant="body1" fontWeight={500} color="info.main">
                              {formatCurrency(data.cashCreditLimit)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                              Saldo actual:
                            </Typography>
                            <Typography 
                              variant="h6" 
                              fontWeight={600}
                              color={getBalanceColor(data.currentBalance)}
                            >
                              {formatCurrency(data.currentBalance)}
                            </Typography>
                          </Box>
                          
                          <Divider />
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                              Crédito del ciclo actual:
                            </Typography>
                            <Typography variant="body1" fontWeight={500} color="success.main">
                              {formatCurrency(data.currentCycleCredit)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                              Débito del ciclo actual:
                            </Typography>
                            <Typography variant="body1" fontWeight={500} color="error.main">
                              {formatCurrency(data.currentCycleDebit)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Resumen del cliente
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Badge sx={{ fontSize: 16, mr: 0.5 }} />
                              ID del cliente:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.customerId}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Security sx={{ fontSize: 16, mr: 0.5 }} />
                              SSN:
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                              {formatSSN(data.customerSsn)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                              Fecha de nacimiento:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(data.dateOfBirth)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CreditScore sx={{ fontSize: 16, mr: 0.5 }} />
                              Puntaje FICO:
                            </Typography>
                            <Chip
                              label={data.ficoScore}
                              color={
                                data.ficoScore && data.ficoScore >= 750 ? 'success' :
                                data.ficoScore && data.ficoScore >= 650 ? 'warning' : 'error'
                              }
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Titular principal:
                            </Typography>
                            <Chip
                              label={data.primaryCardHolderFlag === 'Y' ? 'Sí' : 'No'}
                              color={data.primaryCardHolderFlag === 'Y' ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <ContactPhone sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Información de contacto y personal
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                              Nombre completo
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                              {[data.firstName, data.middleName, data.lastName]
                                .filter(Boolean)
                                .join(' ')}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                                  Teléfono 1:
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {data.phoneNumber1 || 'N/A'}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                                  Teléfono 2:
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {data.phoneNumber2 || 'N/A'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  Identificación gubernamental:
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {data.governmentId || 'N/A'}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  ID de cuenta EFT:
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {data.eftAccountId || 'N/A'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          <Home sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Dirección
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Dirección:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.addressLine1}
                            </Typography>
                            {data.addressLine2 && (
                              <Typography variant="body1" fontWeight={500}>
                                {data.addressLine2}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Ciudad:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.city || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Estado:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.state || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Código postal:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.zipCode || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              País:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {data.country || 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Typography variant="body2" color="text.secondary">
                <KeyboardReturn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                ENTER = Buscar
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExitToApp />}
                onClick={onExit}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                F3 = Salir
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
